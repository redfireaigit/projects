import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import restaurantReducer from "./restaurantReducer";
import orderReducer from "./orderReducer";


export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  orders: orderReducer,
  restaurants: restaurantReducer
});
