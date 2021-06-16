import * as PropTypes from "prop-types";
import React from "react";
import {Link} from "react-router-dom";

export function EditMealCard(props) {
  const {
    meal: { _id, description, name, price },
    onDeleteMeal,
    restaurantId
  } = props;
  return (
      <div className="col-md-4" >
        <div className="card" style={{width: "18rem"}}>
          <img className="card-img-top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5UZ1xO6Jsr_d8fcEEALG4a0XQFQL3JpHpxQ&usqp=CAU" alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">$ {price}</h6>
            <p className="card-text">{description}</p>
            <div className="card-action">
              <a className="waves-effect waves-light btn-small">
                <i className='fas fa-trash' onClick={onDeleteMeal}/>
              </a>
              <a style={{marginLeft: '8px',width: '48px'}} className="waves-effect waves-light btn-small">
                <Link to={`/restaurants/${restaurantId}/meals/update/${_id}`}><i className='fas fa-edit'/></Link>
              </a>
            </div>
          </div>
        </div>
      </div>
  );
}

EditMealCard.propTypes = {
  meal: PropTypes.any,
  onItemAdd: PropTypes.func,
  onItemRemove: PropTypes.func
};
