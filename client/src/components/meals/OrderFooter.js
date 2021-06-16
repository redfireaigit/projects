import * as PropTypes from "prop-types";
import React from "react";

export function OrderFooter(props) {
  const { disabled, onSubmit, orderTotal } = props;
  return (
    <div className="footer-copyright">
      <div className="container">
        <a className="waves-effect waves-light btn">
          Order Total: {orderTotal ? `$${orderTotal}` : 0}
        </a>
          {orderTotal > 0 && (
              <button
                  className={`btn waves-effect waves-light ${
                      disabled ? "disabled" : null
                  }`}
                  style={{marginLeft: '20px'}}
                  type="submit"
                  name="action"
                  onClick={onSubmit}
              >
                  Order Now
              </button>
          )}
      </div>


    </div>
  );
}

OrderFooter.propTypes = {
  orderTotal: PropTypes.any,
  disabled: PropTypes.bool,
  onSubmit: PropTypes.func
};
