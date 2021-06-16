import {
  SET_RESTAURANTS,
  RESTAURANTS_LOADING,
  SET_OWNER_RESTAURANTS,
  DELETE_RESTAURANTS,
  UPDATE_RESTAURANTS, CREATE_RESTAURANTS
} from "../actions/types";

const initialState = {
  ownerRestaurants: [],
  restaurants: [],
  loading: false,
  totalCount: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_RESTAURANTS:
      return {
        ...state,
        restaurants: action.payload,
        loading: false
      };
    case SET_OWNER_RESTAURANTS:
      return {
        ...state,
        ownerRestaurants: action.payload,
        loading: false
      };
    case UPDATE_RESTAURANTS:
      return {
        ...state,
        ownerRestaurants: state.ownerRestaurants.map(item => {
          if(item._id === action.payload.id) {
            return action.payload.data;
          }
          return item
        }),
        loading: false
      };
    case CREATE_RESTAURANTS:
      return {
        ...state,
        ownerRestaurants: [...state.ownerRestaurants, action.payload],
        restaurants: [...state.restaurants, action.payload],
        loading: false
      }
    case DELETE_RESTAURANTS:
      return {
        ...state,
        ownerRestaurants: state.ownerRestaurants.filter(item => item._id !== action.payload),
        restaurants: state.restaurants.filter(item => item._id !== action.payload),
        loading: false
      };
    case RESTAURANTS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}
