import * as PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

export function RestaurantCard(props) {
  const { description, name, _id, type, _meals } = props.rest;

  return (
      <div className="col-md-4" >
        <div className="card" style={{width: "18rem"}}>
          <img className="card-img-top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqmnAkPKOKr5cZV_juv5_QZX_iBh41Md6OFg&usqp=CAU" alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{type}</h6>
            <p className="card-text">{description}</p>
              {_meals.length>0 && <Link class="btn btn-primary" to={`/restaurants/${_id}`}>Order Now</Link>}
              {_meals.length ===0 && <p><b>No Meal available for this Restaurant</b></p>}
          </div>
        </div>
      </div>

  );
}

RestaurantCard.propTypes = { rest: PropTypes.any };
