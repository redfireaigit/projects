import axios from "axios";
import { toast } from "react-toastify";

import {
    GET_ERRORS,
    SET_RESTAURANTS,
    RESTAURANTS_LOADING,
    DELETE_RESTAURANTS,
    UPDATE_RESTAURANTS,
    CREATE_RESTAURANTS,
    SET_OWNER_RESTAURANTS
} from "./types";
import {pick} from "lodash";

export const setLoading = (status) => dispatch => {
    dispatch({
        type: RESTAURANTS_LOADING,
        payload: status
    })
};

export const getRestautants = (currentPage, perPage) => dispatch => {
    axios(`/api/restaurants?page=${currentPage-1}&&perPage=${perPage}`).then(res => {
        let {data} = res.data;
        dispatch({
            type: SET_RESTAURANTS,
            payload: data.restaurants
        })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getOwnerRestautants = (currentPage, perPage) => dispatch => {
    axios(`/api/restaurants/getmanagerresturants?page=${currentPage-1}&&perPage=${perPage}`)
        .then(res => {

            let {data} = res.data;
            dispatch({
                type: SET_OWNER_RESTAURANTS,
                payload: data.restaurants
            })
    }).catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};
export const deleteRestautants = (id) => dispatch => {
    axios.delete(
        `/api/restaurants/${id}`
    ).then((res) => {
        toast(`Restaurant successfully deleted.`);
        dispatch({
            type: DELETE_RESTAURANTS,
            payload: id
        })
    }).catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const updateRestautants = (id, data) => dispatch => {
    axios.patch(
        `/api/restaurants/${id}`,
        data
    ).then((res) => {
        let {data} = res.data;
        toast(`Restaurant successfully updated.`);

        dispatch({
            type: UPDATE_RESTAURANTS,
            payload: {id, data}
        })
    }).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

export const createRestautants = (data) => dispatch => {
    axios.post(
        "/api/restaurants",
        data
    ).then((res) => {
        toast(`Restaurant successfully created.`);
        let {data} = res.data;
        dispatch({
            type: CREATE_RESTAURANTS,
            payload: data
        })
    }).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


// // Login - get user token
// export const loginUser = userData => dispatch => {
//   axios
//     .post("/api/users/login", userData)
//     .then(res => {
//       // Save to localStorage
//
//       // Set token to localStorage
//       const { token } = res.data;
//       localStorage.setItem("jwtToken", token);
//       // Set token to Auth header
//       setAuthToken(token);
//       // Decode token to get user data
//       const decoded = jwt_decode(token);
//       // Set current user
//
//       dispatch(setCurrentUser(decoded));
//     })
//     .catch(err =>
//       dispatch({
//         type: GET_ERRORS,
//         payload: err.response.data
//       })
//     );
// };
//
// // Set logged in user
// export const setCurrentUser = decoded => {
//   return {
//     type: SET_CURRENT_USER,
//     payload: decoded
//   };
// };
//
// // User loading
// export const setUserLoading = () => {
//   return {
//     type: USER_LOADING
//   };
// };
//
// // Log user out
// export const logoutUser = () => dispatch => {
//   // Remove token from local storage
//   localStorage.removeItem("jwtToken");
//   // Remove auth header for future requests
//   setAuthToken(false);
//   // Set current user to empty object {} which will set isAuthenticated to false
//   dispatch(setCurrentUser({}));
// };
