import {
  SET_ORDERS,
  SET_ORDER_HISTORY,
  UPDATE_ORDER_STATUS,
  BLOCK_USER
} from "../actions/types";

const initialState = {
  orders: [],
  orderHistory: [],
  loading: false,
  totalCount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(o =>  {
          if(o._id === action.payload._id){
            o.status = action.payload.status;
          }
          return o;
        }),
        loading: false
      };
    case BLOCK_USER:
      return {
        ...state,
        orders: action.payload,
        loading: false
      };
    case SET_ORDERS:
      return {
        ...state,
        orders: action.payload.orders,
        totalCount: action.payload.totalCount,
        loading: false
      };
    case SET_ORDER_HISTORY:
      return {
        ...state,
        orderHistory: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
