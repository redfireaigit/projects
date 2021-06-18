import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Restaurants from "./components/restaurant/Restaurants";
import MyRestaurants from "./components/restaurant/managers/MyRestaurants";

import "./App.css";
import Meals from "./components/meals/Meals";
import ViewMeals from "./components/meals/manager/ViewMeals";
import CreateMeal from "./components/meals/manager/CreateMeal";
import UpdateMeal from "./components/meals/manager/UpdateMeal";
import Orders from "./components/orders/Orders";
import OrderHistory from "./components/orders/OrderHistory";
import CreateOrUpdateRestaurant from "./components/restaurant/managers/CreateOrUpdateRestaurant";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";


axios.interceptors.response.use(
    async (response) => { return response },
    async (error) => {

      const originalRequest = error.config
      const status = error.response.status
      if (status === 500 || status === 404 || status === 401 || status === 403)
      {
        toast.error(error.response.statusText);
        console.log(error.response)
        return Promise.reject(error)

      }
      else 
      return axios(originalRequest)
    })
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {

    return (

      <Provider store={store}>
        <Router>
          <div className="App">
            <ToastContainer />
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/restaurants" component={Restaurants} />
              <PrivateRoute exact path="/myrestaurants" component={MyRestaurants} />
                <PrivateRoute exact path="/myrestaurants/update/:id" component={CreateOrUpdateRestaurant}/>
                <PrivateRoute exact path="/myrestaurants/:id/meals" component={ViewMeals}/>
              <PrivateRoute
                exact
                path="/restaurants/create"
                component={CreateOrUpdateRestaurant}
              />

              <PrivateRoute exact path="/restaurants/:id" component={Meals} />
              <PrivateRoute exact path="/restaurants/:id/meals/update/:mealID" component={UpdateMeal} />
              <PrivateRoute exact path="/restaurants/:id/meal/create/" component={CreateMeal} />
              <PrivateRoute exact path="/orders" component={Orders} />
              <PrivateRoute exact path="/orderHistory/:id" component={OrderHistory} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
