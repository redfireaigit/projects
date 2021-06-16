import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Loader } from "../../Loader";
import { pick } from "lodash";
import get from "lodash/get";
import { toast } from "react-toastify";

class UpdateMeal extends Component {
  state = { userInfo: {}, id: null, loading: false, _meal: { name: "", price: 0, description: "" } };

  async componentDidMount() {
    try {
      this.setState({loading: true});
      let id = this.restaurantId;
      let meal = await axios.get(`/api/meals/${this.mealId}/restaurants/${this.restaurantId}`);
      let {data} = meal.data;
      this.setState({id, _meal: data, userInfo: this.props.auth.user, loading: false});
    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      } else {
        toast.error(e.response.data.error);
      }
    }
  }

  onRowDataChange = (e, field) => {
    let _meal = this.state._meal;
    _meal[field] = e.target.value
    this.setState({ _meal});

  };
  get restaurantId() {
    return get(this.props.match, "params.id");
  }

  get mealId() {
    return get(this.props.match, "params.mealID");
  }

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, id: this.restaurantId });
    try {
      await axios.patch(
          `/api/meals/${this.mealId}/`,
          pick(this.state, [ "id", "_meal"])
      );
      toast(`Meal ${this.state._meal.name} successfully created.`);
      this.props.history.push(`/myrestaurants/${this.restaurantId}/meals`);
    } catch (e) {
      if (e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.setState({loading: false});
    }
  };

  render() {

    const { userInfo, _meal, loading } = this.state;
    if (loading) return <Loader />;
    if (userInfo.role !== "manager") return "You are not authorized.";
    return (
        <div className="container">
          <div className="row">
            <form noValidate onSubmit={this.onSubmit}>
              <h3>Meal</h3>
              <tr>
                <td>
                  <input onChange={e => this.onRowDataChange(e, "name")} value={_meal.name} type="text" />
                </td>
                <td>
                  <input
                      onChange={e => this.onRowDataChange(e, "price")}
                      value={_meal.price}
                      type="number"
                  />
                </td>
                <td>
                  <input
                      onChange={e => this.onRowDataChange(e, "description")}
                      value={_meal.description}
                      type="text"
                  />
                </td>
              </tr>
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
  auth: state.auth
});

export default connect(mapStateToProps)(UpdateMeal);
