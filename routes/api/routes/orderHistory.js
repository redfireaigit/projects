const express = require("express");
const controller = require("../controllers/orderHistory.controller");
const auth = require("../auth/auth.service");

const router = express.Router();

router.get("/:id", auth.hasRole("user"), controller.index);

module.exports = router;
