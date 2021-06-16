import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Loader } from "../../Loader";
import { pick } from "lodash";
import { RestaurantDetails } from "../RestaurantDetails";
import get from "lodash/get";
import { toast } from "react-toastify";
import {setLoading, updateRestautants, createRestautants} from './../../../actions/restaurantActions';

class CreateOrUpdateRestaurant extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {},
      loading:false,
      description: "",
      name: "",
      type: ""
    };
  }

  async componentDidMount() {
    try {

      var resID;
      var response;
      this.setState({loading: true});
      resID = get(this.props.match, "params.id");
      if (resID) {
        response = await axios(`/api/restaurants/${resID}`);
        let {data} = response.data;
        let {description, name, type} = data;
        this.setState({description, name, type});
      }
      this.setState({userInfo: this.props.auth.user, loading: false});
    } catch (e) {
      if(e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.setState({loading: false});

    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onAdd = () => {
    const { _meals } = this.state;
    this.setState({
      _meals: [..._meals, { name: "", price: 0, description: "" }]
    });
  };

  onDelete = index => {
    const { _meals } = this.state;
    this.setState({
      _meals: [..._meals.slice(0, index), ..._meals.slice(index + 1)]
    });
  };

  onRowDataChange = (e, field, index) => {
    const meals = [...this.state._meals];
    this.setState({
      _meals: [
        ...meals.slice(0, index),
        { ...meals[index], [field]: e.target.value },
        ...meals.slice(index + 1)
      ]
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      let resID =  get(this.props.match, "params.id");
      if(resID) {
        this.props.setLoading(true);
        this.props.updateRestautants(resID, pick(this.state, ["name", "type", "description"]))
      } else {
        this.props.setLoading(true);
        this.props.createRestautants(pick(this.state, ["name", "type", "description"]))
      }
      this.props.history.push("/myrestaurants");
    } catch (e) {
      if(e.response.data) {
        toast.error(e.response.data.error.message);
      }
    }
  };

  render() {

    const { name, type, description, userInfo, loading } = this.state;

    if (loading) return <Loader />;
    if (userInfo.role !== "manager") return "You are not authorized.";
    return (
      <div className="container">
        <div className="row">
          <form noValidate onSubmit={this.onSubmit}>
            <RestaurantDetails
              onChange={this.onChange}
              name={name}
              type={type}
              description={description}
            />

            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                type="submit"
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  restaurants: state.restaurants
});

export default connect(mapStateToProps, {setLoading, updateRestautants, createRestautants})(CreateOrUpdateRestaurant);
