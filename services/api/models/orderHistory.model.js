const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const OrderHistorySchema = new Schema({
  status: { type: String, required: true, default: "placed" },
  created_at: {
    type: Date,
    default: Date.now
  },
  _user: { type: Schema.ObjectId, ref: "User" },
  _restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
  _order: { type: Schema.ObjectId, ref: "Order" }
});

module.exports = OrderHistory = mongoose.model("OrderHistory", OrderHistorySchema);
