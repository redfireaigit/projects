const OrderHistory = require("../models/orderHistory.model");
const _ = require("lodash");
const {ResponseHandler} = require('../../httpStatusCodes')
const { ObjectId } = require('mongodb');

function handleError(res, err) {
  return res.send(500, err);
}

// Get list of orderHistory
exports.index = function(req, res) {

  OrderHistory.find({ _order: ObjectId(req.params.id) })
    .sort({"created_at": -1})
    .populate("_user")
    .populate("_order")
    .populate("_restaurant")
    .exec(function(err, history) {
      if (err) {
          ResponseHandler(res, 500, null, err)
      } else{
          ResponseHandler(res, 200, history)
      }
    });
};

