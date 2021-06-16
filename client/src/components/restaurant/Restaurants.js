import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import { Loader } from "../Loader";
import { RestaurantCard } from "./RestaurantCard";
import {toast} from "react-toastify";
import Pagination from 'react-bootstrap-4-pagination';
import {setLoading, getRestautants} from "../../actions/restaurantActions";

class Restaurants extends Component {
  state = { restaurants: [], loading: false, paginationConfig : {
      perPage: 10,
      totalPages: 1,
      currentPage: 1,
      threeDots: true,
      prevNext: true,
      onClick: (page)=>this.onPageChange(page)
    }
  };

  async componentDidMount() {
    try {
        this.props.setLoading( true );
        let {paginationConfig} = this.state;
        let {currentPage, perPage} = paginationConfig;
        this.props.getRestautants(currentPage, perPage);

        setLoading({ loading: false });
    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      }
      else {
          toast.error(e.response.data.error);
      }
      this.props.setLoading( false );
    }
  }
  viewRestaurant = id => {
    this.props.history.push("/restaurants/"+id);
  };

    onPageChange = async page => {
        try {
            this.props.setLoading( true );
            let {paginationConfig} = this.state;
            let {perPage} = paginationConfig;
            this.props.getRestautants(page, perPage);
            paginationConfig.currentPage = page;
            this.setState({paginationConfig});
        } catch (e) {
            if (e.response.data) {
                toast.error(e.response.data.error.message);
            }
            this.props.setLoading( false );
        }
    }

  render() {

    const { loading, restaurants, totalCount } = this.props.restaurants;
    let paginationConfig = this.state.paginationConfig;
    paginationConfig.totalPages = parseInt((totalCount/paginationConfig.perPage)+1 , 10);

    if (restaurants.length === 0 && !loading)
      return <div className="center">No Restaurants Found.</div>;

    return (
      <div className="container" style={{ width: "100%" }}>
        <div className="row">
          <div >
            {loading ? (
              <Loader />
            ) : (
              <div className="row">
                {restaurants.map(rest => (
                  <RestaurantCard key={rest._id} viewRestaurant={this.viewRestaurant} rest={rest} />
                ))}
              </div>
            )}
          </div>
        </div>
          <div className="row">
              <Pagination {...this.state.paginationConfig} />
          </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
    restaurants: state.restaurants
});

export default connect(mapStateToProps, { setLoading, getRestautants })(Restaurants);

