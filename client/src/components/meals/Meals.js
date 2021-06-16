import React, { Component } from "react";
import get from "lodash/get";
import axios from "axios";

import { Loader } from "../Loader";
import { MealCard } from "./MealCard";
import { OrderFooter } from "./OrderFooter";
import {toast} from "react-toastify";

class Meals extends Component {
  state = { meals: [], loading: false, submitting: false };

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const response = await axios(`/api/restaurants/${this.restaurantId}`);
      let {data } = response.data;
      this.setState({ meals: data._meals, loading: false });
    } catch (e) {
      console.error(e);
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

  handleSubmit = async () => {
    try{
      const payload = {
        total_amount: this.orderTotal,
        _restaurant: this.restaurantId,
        _meals: []
      };
      this.state.meals.forEach(meal => {
        if (meal.total) payload._meals.push(meal._id);
      });
      this.setState({ submitting: true });
      await axios.post("/api/orders", payload);
      const { push } = this.props.history;
      push("/orders");
      this.setState({ submitting: false });

    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      } else {
        toast.error(e.response.data.error);
      }
      this.setState({ submitting: false });

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
    const { loading, meals, submitting } = this.state;

    if (meals.length === 0 && !loading)
      return <div>
              <div className="center">No Meals Found.</div>
            </div>;

    return (
      <div className="container">
        <div className="row">
          {loading ? (
            <Loader />
          ) : (
               <div className="container">
                <div className="row">
                  {(meals || []).map((meal, index) => (
                    <MealCard
                      key={get(meal, "name")}
                      meal={meal}
                      onItemAdd={() => this.onIncrement(index)}
                      onItemRemove={() => this.onDecrement(index)}
                    />
                  ))}
                </div>
                <OrderFooter
                  orderTotal={this.orderTotal}
                  disabled={submitting}
                  onSubmit={this.handleSubmit}
                />
              </div>
          )}
        </div>
      </div>
    );
  }
}

export default Meals;
