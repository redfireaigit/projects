import React, { Component } from "react";
import get from "lodash/get";
import axios from "axios";

import { Loader } from "../../Loader";
import { EditMealCard } from "./EditMealCard";
import { toast } from "react-toastify";
import {cloneDeep} from "lodash";

class ViewMeals extends Component {
  state = { meals: [], loading: false, submitting: false };

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await axios(`/api/restaurants/${this.restaurantId}`, {headers:{"Content-Type" : "application/json"}});
      let {data} = response.data;
      this.setState({ meals: data._meals, loading: false });
    } catch (e) {
      if(e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.setState({ loading: false });
    }
  }

  onIncrement = index => {
    const { meals } = this.state;
    const { total } = meals[index];
    this.setState({
      meals: [
        ...meals.slice(0, index),
        { ...meals[index], total: (total || 0) + 1 },
        ...meals.slice(index + 1)
      ]
    });
  };

  addMeal = index => {
    const { push } = this.props.history;
    push(`/restaurants/${this.restaurantId}/meal/create`);
  };

  onDecrement = index => {
    const { meals } = this.state;
    const { total } = meals[index];
    if (!total) return;
    this.setState({
      meals: [
        ...meals.slice(0, index),
        { ...meals[index], total: total - 1 },
        ...meals.slice(index + 1)
      ]
    });
  };

  handleDelete = async _id => {
    this.setState({ loading: true });
    try {
      await axios.delete(`/api/meals/${_id}`, {data: {id: this.restaurantId}});
      let meals = cloneDeep(this.state.meals);
      meals = meals.filter(m => m._id !== _id);
      this.setState({ meals: meals, loading: false });
    } catch (e) {
      if(e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.setState({ submitting: false });
    }
  };


  handleSubmit = async () => {
    const payload = {
      total_amount: this.orderTotal,
      _restaurant: this.restaurantId,
      _meals: []
    };
    this.state.meals.forEach(meal => {
      if (meal.total) payload._meals.push(meal._id);
    });
    this.setState({ submitting: true });
    try {
      await axios.post("/api/orders", payload);
      const { push } = this.props.history;
      push("/orders");
    } catch (e) {
      this.setState({ submitting: false });
      console.error(e);
    }
  };

  get restaurantId() {
    return get(this.props.match, "params.id");
  }

  get orderTotal() {
    return this.state.meals.reduce((total, meal) => {
      return total + meal.price * (meal.total || 0);
    }, 0);
  }

  render() {
    const { loading, meals } = this.state;

    if (meals.length === 0 && !loading)
      return <div className='container center'>
        <button onClick={this.addMeal}>add meal</button>
        <div className="center">No Meals Found.</div>
      </div>;

    return (
      <div className="container">
        <div className="row">
          {loading ? (
            <Loader />
          ) : (
               <div className="container">
                 <button onClick={this.addMeal}>add meal</button>
                <div className="row">
                  {(meals || []).map((meal, index) => (
                    <EditMealCard
                      key={get(meal, "name")}
                      meal={meal}
                      restaurantId={this.restaurantId}
                      onItemAdd={() => this.onIncrement(index)}
                      onItemRemove={() => this.onDecrement(index)}
                      onDeleteMeal={()=> this.handleDelete(meal._id)}
                    />
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
    );
  }
}

export default ViewMeals;
