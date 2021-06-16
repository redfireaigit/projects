import * as PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

export function UpdateRestaurantCard(props) {
  const { description, name, _id, type } = props.rest;
  return (
    <div className="col-md-4">
      <div className="card" style={{width: "18rem"}}>
        <img className="card-img-top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqmnAkPKOKr5cZV_juv5_QZX_iBh41Md6OFg&usqp=CAU" alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{type}</h6>
            <p className="card-text">{description}</p>
              <Link style={{margin: '0 10px'}} class="btn btn-primary pd-10" to={`/myrestaurants/${_id}/meals`}><i className='fas fa-eye'></i></Link>
            <Link  style={{margin: '0 10px'}} class="btn btn-primary pd-10" to={`/myrestaurants/update/${_id}`}><i className='fas fa-edit'></i></Link>
            <i  style={{margin: '0 10px'}} className='btn btn-primary  fas fa-trash' onClick={()=>props.deleteRestaurant(_id)}></i>
          </div>
      </div>
    </div>
  );
}

UpdateRestaurantCard.propTypes = { rest: PropTypes.any };
