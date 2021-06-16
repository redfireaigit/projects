const express = require("express");
const controller = require("./restaurant.controller");
const auth = require("../auth/auth.service");

const router = express.Router();

router.get("/", auth.hasRole("user"), controller.index);
router.get("/getmanagerresturants", auth.hasRole("manager"), controller.getManagerRestaurants);
router.get("/:id", auth.hasRole("user"), controller.show);
router.post("/", auth.hasRole("manager"), controller.create);
router.put("/:id", auth.hasRole("manager"), controller.update);
router.patch("/:id", auth.hasRole("manager"), controller.update);
router.delete("/:id", auth.hasRole("manager"), controller.destroy);
router.post("/:id/blockuser", auth.hasRole("manager"), controller.blockUser);
module.exports = router;
