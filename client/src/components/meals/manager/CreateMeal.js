import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Loader } from "../../Loader";
import { pick } from "lodash";
import { MealRow } from "../MealRow";
import { MealTable } from "../MealTable";
import get from "lodash/get";
import { toast } from "react-toastify";

class CreateMeal extends Component {
  state = { userInfo: {}, id: null, _meals: [{ name: "", price: 0, description: "" }] };

  async componentDidMount() {
    this.setState({ loading: true });
    let id = this.restaurantId
    this.setState({ id, userInfo: this.props.auth.user, loading: false });
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

  get restaurantId() {
        return get(this.props.match, "params.id");
  }

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, id: this.restaurantId });
    try {
      await axios.post(
        "/api/meals",
        pick(this.state, [ "id", "_meals"])
      );
      toast(`Meal successfully created.`);
      this.props.history.push(`/myrestaurants/${this.restaurantId}/meals`);
    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      } else {
        toast.error(e.response.data.error);
      }
      this.setState({ loading: false });
    }
  };

  render() {
    const { userInfo, _meals, loading } = this.state;
    if (loading) return <Loader />;
    if (userInfo.role !== "manager") return "You are not authorized.";
    return (
      <div className="container">
        <div className="row">
          <form noValidate onSubmit={this.onSubmit}>
            <h3>Meals</h3>
            <MealTable
              meals={_meals}
              render={(meal, index) => {
                const { price, description: mealDesc, name: mealName } = meal;
                return (
                  <MealRow
                    key={index}
                    onNameChange={e => this.onRowDataChange(e, "name", index)}
                    name={mealName}
                    onPriceChange={e => this.onRowDataChange(e, "price", index)}
                    price={price}
                    onDescriptionChange={e =>
                      this.onRowDataChange(e, "description", index)
                    }
                    description={mealDesc}
                    meals={_meals}
                    onDelete={() => this.onDelete(index)}
                  />
                );
              }}
            />
            <i
                style={{ color: "indianred", cursor: "pointer" }}
                className="fas fa-plus"
                onClick={this.onAdd}
            >
              Add More
            </i>
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

export default connect(mapStateToProps)(CreateMeal);
