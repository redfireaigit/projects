import React, { Component } from "react";
import axios from "axios";

import { Loader } from "../Loader";
import { OrderCard } from "./OrderCard";
import { cloneDeep } from "lodash";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import Pagination from 'react-bootstrap-4-pagination';
import {setLoader, getOrders, changeOrderStatus, blockUser} from '../../actions/orderActions';

class Orders extends Component {
  state = { orders: [], loading: false, paginationConfig : {
      perPage: 10,
      totalPages: 1,
      currentPage: 1,
      threeDots: true,
      prevNext: true,
      onClick: (page)=>this.onPageChange(page)
    } };

  async componentDidMount() {
    try {
      this.props.setLoader(true);
      let {perPage, currentPage} = this.state.paginationConfig;
      this.props.getOrders(currentPage, perPage);
    } catch (e) {
      if(e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.setState({ loading: false });
    }
  }

  onPageChange = async page => {
    try {
      this.props.setLoader(true)
      let {perPage} = this.state.paginationConfig;
      this.props.getOrders(page, perPage);
      let {paginationConfig} = this.state;
      paginationConfig.currentPage = page;
      this.setState({paginationConfig});
    } catch (e) {
      if (e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.setState({loading: false});
    }
  }

  onOrderStatusChange = async (order, status, index) => {
    this.props.changeOrderStatus(index,order._id, { status, _restaurant: order._restaurant._id } )
  };

  onBlockUser = async (order, index) => {
    try {
      let resID = order._restaurant._id;
      let userID = order._user._id;
      const orders = cloneDeep(this.props.orders.orders);
      let blockList = order._restaurant.blockList.filter(b => b === userID);
      let status = 'blocked';

      if (blockList.length) {
        status = 'unblocked';
        orders[index]._restaurant.blockList = order._restaurant.blockList.filter(b => b != userID);
      } else {
        status = 'blocked';
        orders[index]._restaurant.blockList.push(userID)
      }

      this.props.blockUser(resID, userID, orders, status);

    } catch (e) {
      if(e.response.data) {
        toast.error(e.response.data.error.message);
      }
    }
  };

  render() {
    const { loading, orders, totalCount } = this.props.orders;
    let paginationConfig = this.state.paginationConfig;
    paginationConfig.totalPages = parseInt((totalCount/paginationConfig.perPage)+1 , 10);

    if (orders.length === 0 && !loading)
      return <div className="center">No Orders Found.</div>;
    return (
      <div className="container" style={{ width: "100%" }}>
        <div className="row">
            {loading ? (
              <Loader />
            ) : (
              <div className="row">
                <h3>Orders</h3>
                <table id="example" className="table table-striped table-bordered" style={{"width":"100%"}}>
                  <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Restaurant Name</th>
                    <th>Total Amount</th>
                    <th>Order status</th>
                    <th>Action</th>
                    <th>History</th>
                  </tr>
                  </thead>
                  <tbody>
                  {orders.map((rest, index) => (
                      <OrderCard
                          key={rest._id}
                          order={rest}
                          currentUser={this.props.auth.user}
                          onStatusChange={status =>
                              this.onOrderStatusChange(rest, status, index)
                          }

                          onBlockUser={status =>
                              this.onBlockUser(rest, index)
                          }
                      />
                  ))}
                  </tbody>
                </table>
              </div>
            )}
          <Pagination {...this.state.paginationConfig} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  orders: state.orders
});

export default connect(mapStateToProps, {setLoader, getOrders, changeOrderStatus, blockUser } )(Orders);


