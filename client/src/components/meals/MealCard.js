import * as PropTypes from "prop-types";
import React from "react";

export function MealCard(props) {
  const {
    onItemAdd,
    meal: { description, name, price, total },
    onItemRemove,
  } = props;
  return (
      <div className="col-md-4" >
        <div className="card" style={{width: "15rem"}}>
          <img className="card-img-top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5UZ1xO6Jsr_d8fcEEALG4a0XQFQL3JpHpxQ&usqp=CAU" alt="Card image cap" />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">$ {price}</h6>
            <p className="card-text">{description}</p>
            <div className="card-action">
              <a onClick={onItemAdd} className="waves-effect waves-light btn-small">
                <i  className="fas fa-plus"></i>
              </a>
              <span  style={{fontSize: '20px', margin: '10px'}}>
              {total || 0}
            </span>
              <a onClick={onItemRemove} className="waves-effect waves-light btn-small">
                <i className="fas fa-minus">
                </i>
              </a>
            </div>
          </div>
        </div>
      </div>


  );
}

MealCard.propTypes = {
  meal: PropTypes.any,
  onItemAdd: PropTypes.func,
  onItemRemove: PropTypes.func
};
