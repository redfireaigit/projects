import React, { Component } from "react";
import axios from "axios";
import { Loader } from "../Loader";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import get from "lodash/get";
import Moment from 'react-moment';
import {getOrderHistory, setLoader} from "../../actions/orderActions";


class OrderHistory extends Component {
  state = { orderHistory: [], loading: false };

  async componentDidMount() {
    try {
      this.setState({ loading: true });
      this.props.getOrderHistory(this.orderId);
    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      } else {
        toast.error(e.response.data.error);
      }
      this.setState({ loading: false });

    }
  }

  get orderId() {
    return get(this.props.match, "params.id");
  }
  render() {
    const { loading, orderHistory } = this.props.orders;

    if (orderHistory.length === 0 && !loading)
      return <div className="center">No Order History Found.</div>;

    return (
      <div className="container" style={{ width: "100%" }}>
        <div className="row">
          <div className="landing-copy col s12 center-align">
            {loading ? (
              <Loader />
            ) : (
              <div className="row">
                <h3>Order History</h3>
                <table id="example" className="table table-striped table-bordered" style={{"width":"100%"}}>
                  <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Restaurant</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                  </thead>
                  <tbody>
                  {orderHistory.map((order, index) => <tr key={index}>
                    <td style={{textAlign: 'center'}}>{order._user.name}-{order._user.role}</td>
                    <td style={{textAlign: 'center'}}>{order._restaurant.name}</td>
                    <td style={{textAlign: 'center'}}>$ {order._order.total_amount}</td>
                    <td style={{textAlign: 'center'}}>{order.status}</td>
                    <td style={{textAlign: 'center'}}><Moment fromNow>{order.created_at}</Moment></td>
                  </tr>)}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth,
  orders: state.orders
});

export default connect(mapStateToProps, {setLoader, getOrderHistory } )(OrderHistory);

