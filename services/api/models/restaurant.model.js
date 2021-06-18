const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: 1 },
  user: { type: String, required: true },
  _meals: [{ type: Schema.ObjectId, ref: "Meal" }],
  blockList: [{ type: Schema.ObjectId, ref: "User" }],
  created_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = Restaurant = mongoose.model("Restaurant", RestaurantSchema);
