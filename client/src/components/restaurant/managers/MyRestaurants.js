import React, { Component } from "react";
import { Loader } from "../../Loader";
import { UpdateRestaurantCard } from "./UpdateRestaurantCard";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import Pagination from 'react-bootstrap-4-pagination';
import {connect} from "react-redux";
import {getOwnerRestautants, setLoading, deleteRestautants} from "../../../actions/restaurantActions";

class MyRestaurants extends Component {
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
      this.props.getOwnerRestautants(currentPage, perPage);

    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      } else {
        toast.error(e.response.data.error);
      }
      this.props.setLoading( false );
    }
  }

  onPageChange = async page => {
    try {
      this.props.setLoading( true );
      let {paginationConfig} = this.state;
      let {perPage} = paginationConfig;
      this.props.getOwnerRestautants(page, perPage);
      paginationConfig.currentPage = page;
      this.setState({paginationConfig});
    } catch (e) {
      if (e.response.data) {
        toast.error(e.response.data.error.message);
      }
      this.props.setLoading( false );
    }
  }

  deleteRestaurant = async id => {
    try {

      this.props.setLoading( true );
      this.props.deleteRestautants(id)
    } catch (e) {
      if(e.response.data.error.message) {
        toast.error(e.response.data.error.message);
      } else {
        toast.error(e.response.data.error);
      }
      this.setState({loading: false});
    }
  };

  render() {
    const { loading, ownerRestaurants, totalCount } = this.props.restaurants;
    let paginationConfig = this.state.paginationConfig;
    paginationConfig.totalPages = parseInt((totalCount/paginationConfig.perPage)+1 , 10);
    return (
        <div className="container">
          <main>
            <header className="row tm-welcome-section" >
              <h2 style={{marginTop: '20px'}} className="col-12 text-center tm-section-title">Welcome to Toptal food House</h2>
              <p className="col-12 text-center"></p>
            </header>
            {(ownerRestaurants.length === 0 && !loading) &&<>
              <li className="tm-paging-item"><Link  className="tm-paging-link active" to={`/restaurants/create`}>Add Resturant</Link></li>
              <div className="center">No Restaurants Found.</div></>}
            {!(ownerRestaurants.length === 0 && !loading) &&
              <div className="row tm-gallery" style={{display: 'contents'}}>
                <li className="tm-paging-item"><Link  className="tm-paging-link active" to={`/restaurants/create`}>Add Resturant</Link></li>
                <div id="tm-gallery-page-pizza" className="row" style={{display: 'flex'}}  >
                  {loading ? (
                      <Loader/>
                  ) : (
                      <>
                        {ownerRestaurants.map(rest => (
                            <UpdateRestaurantCard key={rest._id} deleteRestaurant={this.deleteRestaurant} rest={rest}/>
                        ))}
                      </>
                  )}
              </div>
                <div className="row">
                  <Pagination {...this.state.paginationConfig} />
                </div>
            </div>
            }
          </main>

        </div>
    );
  }
}

const mapStateToProps = state => ({
  restaurants: state.restaurants
});

export default connect(mapStateToProps, { deleteRestautants, setLoading, getOwnerRestautants })(MyRestaurants);
