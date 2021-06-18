import * as PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

export function OrderCard(props) {
  const { _id, _restaurant, status, total_amount, _user } = props.order;

  let isBlocked = _restaurant.blockList.filter(b => b == _user._id).length ? true : false
  return (
      <tr>
        <td style={{textAlign: 'center'}}>{_user.name}</td>
        <td style={{textAlign: 'center'}}>{_restaurant.name}</td>
        <td style={{textAlign: 'center'}}>$ {total_amount}</td>
        <td style={{textAlign: 'center'}}>{[
            "placed",
            "cancelled",
            "processing",
            "in_route",
            "delivered",
            "received"
        ].map(stat => {
            if((props.currentUser.role === 'user' && (stat !== 'cancelled' && stat !== 'received'))) {
                return <div
                    key={stat}
                    style={{
                        cursor: "not-allowed",
                        color: status === stat ? "green" : "unset",
                        fontWeight: status === stat ? 800 : "unset"
                    }}
                    className="chip"
                >
                    {stat}
                </div>
            } else {
                return <div
                    key={stat}
                    style={{
                        cursor: "pointer",
                        color: status === stat ? "green" : "unset",
                        fontWeight: status === stat ? 800 : "unset"
                    }}
                    className="chip"
                    onClick={  () => props.onStatusChange(stat)}
                >
                    {stat}
                </div>
            }

        })}</td>
        <td style={{textAlign: 'center'}}> <button
            disabled={!( props.currentUser.role === 'manager' && _user.role === 'user' )}
            onClick={()=> props.onBlockUser()}
            style={{ fontWeight: 700 }}>
          {isBlocked && <span style={{fontSize: '10px'}}>UnBlock user</span>}
          {!isBlocked && <span style={{fontSize: '10px'}}>Block user</span>}
        </button></td>
        <td style={{textAlign: 'center'}}><Link to={`/orderHistory/${_id}`} style={{ fontWeight: 700 }}>View history</Link></td>

      </tr>

  );
}

OrderCard.propTypes = { order: PropTypes.any };
