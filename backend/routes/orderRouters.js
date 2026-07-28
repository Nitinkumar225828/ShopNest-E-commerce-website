const express = require("express");
const {protect} = require("../middleware/authmiddleware");
const {admin} = require("../middleware/adminmiddleware");
const {getOrders, createOrder, myOrders, updateOrderStatus} = require("../controllers/orderController");

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);
router.route("/myorders").get(protect, myOrders);
router.route("/:id/status").put(protect, admin, updateOrderStatus);


module.exports = router;