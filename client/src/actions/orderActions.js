import axios from "axios";

import {GET_ERRORS, ORDER_LOADING, SET_ORDERS, SET_ORDER_HISTORY, UPDATE_ORDER_STATUS, BLOCK_USER } from "./types";
import {toast} from "react-toastify";

export const setLoader = (status) => dispatch => {
    dispatch({
        type: ORDER_LOADING,
        payload: status
    })
};

export const getOrders = (page, perPage) => dispatch => {
    axios(
        `/api/orders?page=${page-1}&&perPage=${perPage}`
    ).then((res) => {
        let {data} = res.data;

        dispatch({
            type: SET_ORDERS,
            payload: data
        })
    }).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

export const getOrderHistory = (id ) => dispatch => {
    axios(`/api/orderHistory/${id}`)
        .then((res) => {
        let {data} = res.data;

        dispatch({
            type: SET_ORDER_HISTORY,
            payload: data
        })
    }).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

export const changeOrderStatus = (index, id, data) =>dispatch=> {
    axios.put(
        `/api/orders/${id}` , data
    ).then((res) => {
        let {data} = res.data;
        toast(`Order successfully updated.`);

        dispatch({
            type: UPDATE_ORDER_STATUS,
            payload: data
        })
    }).catch(e => {
        if(e.response.data) {
            if(e.response.data.error.message) {
                toast.error(e.response.data.error.message);
            } else {
                toast.error(e.response.data.error);
            }
        }
        });
};

export const blockUser = (resID, userID, orders, status) => dispatch => {
    axios.post(`/api/restaurants/${resID}/blockuser`, { id: userID })
        .then((res) => {
        toast(`User ${status} for this restaurant successfully.`);

        dispatch({
            type: BLOCK_USER,
            payload: orders
        })

    }).catch(e => {
        if(e.response.data) {
            if(e.response.data.error.message) {
                toast.error(e.response.data.error.message);
            } else {
                toast.error(e.response.data.error);
            }
        }
    });
};

