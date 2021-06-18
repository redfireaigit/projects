const Order = require("../models/order.model");
const OrderHistory = require("../models/orderHistory.model");
const _ = require("lodash");
const StateMachine = require("javascript-state-machine");
const auth = require("../auth/auth.service");
const {ResponseHandler} = require('../../httpStatusCodes')

function createStateMachine(order) {
  return new StateMachine({
    init: order.status,
    transitions: [
      { name: "cancelled", from: "placed", to: "cancelled" },
      { name: "processing", from: "placed", to: "processing" },
      { name: "in_route", from: "processing", to: "in_route" },
      { name: "delivered", from: "in_route", to: "delivered" },
      { name: "received", from: "delivered", to: "received" }
    ]
  });
}

// Get list of orders
exports.index = function(req, res) {
  let perPage = parseInt(req.query.perPage, 10), page = Math.max(0, req.query.page)

  let filter = req.user.role === "user" ? { _user: req.user._id } : {}
  Order.find(filter)
    .sort({"created_at": -1})
    .skip(perPage * page)
    .limit(perPage)
    .populate("_restaurant")
    .populate("_user", 'name role')
    .exec(function(err, orders) {
      if (err) {
        ResponseHandler(res, 500, null, err)
      } else {
        Order.count(filter).exec(function(err, count) {
          let result = {
            totalCount: count,
            currentPage: page,
            orders: orders
          }
          ResponseHandler(res, 200, result )
        })
      }
    });
};

// Get list of restaurant orders
exports.restaurant_index = function(req, res) {
  let filter = auth.hasRole("user") ? { _restaurant: req.user._id } : {}

  Order.find(filter)
    .sort({"created_at": -1})
    .populate("_restaurant")
    .populate("_user", "name, role, email")
    .exec(function(err, orders) {
      if (err) {
        ResponseHandler(res, 500, null, err)
      } else
      ResponseHandler(res, 200, orders )
    });
};

// Get a single order
exports.show = function(req, res) {
  Order.findById(req.params.id)
    .populate("_meals")
    .populate("_user", "name, role, email")
    .populate("_restaurant")
    .exec(function(err, order) {
      if (err) {
        ResponseHandler(res, 500, null, err)
      }

      else if (!order) {
        ResponseHandler(res, 404)
      } else
      ResponseHandler(res, 200, order )
    });
};

exports.create = function(req, res) {

  Order.create({ ...req.body, _user: req.user._id }, function(err, order) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    } else {
      order.populate();
      let history = {
        _restaurant: req.body._restaurant,
        _user: req.user._id,
        _order: order.id
      }
      OrderHistory.create(history, function(err) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        }
      });

      ResponseHandler(res, 200, order )
    }

  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!order) {
      ResponseHandler(res, 404)
    }
    else{
      const fsm = createStateMachine(order);
      if (fsm.cannot(req.body.status)){
        ResponseHandler(res, 403, null, `Not a valid transition from ${order.status} to ${req.body.status}.`)
      } else {
        const updated = _.merge(order, req.body);
        updated.save(function(err) {
          if (err) {
            ResponseHandler(res, 500, null, err)
          }
          else{
            let history = {
              _restaurant: req.body._restaurant,
              _user: req.user._id,
              _order: order.id,
              status: order.status
            };
            OrderHistory.create(history, function(err) {
              if (err) {
                ResponseHandler(res, 500, null, err)
              }
            });
            ResponseHandler(res, 200, order )
          }

        });
      }
    }
  });
};

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function(err, order) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!order) {
      ResponseHandler(res, 404)
    } else {
      order.remove(function(err) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        } else
        ResponseHandler(res, 200, order )
      });
    }
  });
};
