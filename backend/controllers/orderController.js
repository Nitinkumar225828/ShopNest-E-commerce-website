const Order = require("../models/orderModel");
const sendEmail = require("../utils/sendEmail");

const normalizeOrder = (order) => {
  const orderDoc = order.toObject ? order.toObject() : { ...order };
  orderDoc.totalAmount = orderDoc.totalAmount ?? orderDoc.totalPrice ?? 0;
  return orderDoc;
};

// @desc    Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, totalAmount, address, paymentId } = req.body;
    const orderTotal = totalPrice ?? totalAmount;

    if (!items || !Array.isArray(items) || items.length === 0 || orderTotal === undefined || orderTotal === null || orderTotal === "" || !address) {
        return res.status(400).json({ message: "Invalid order data" });
    }

    const order = new Order({
        user: req.user._id,
        items,
        totalPrice: orderTotal,
        address,
        paymentId,
    });

    const createdOrder = await order.save();

    try {
        await sendEmail(req.user.email, "Order Confirmation", `Your order with ID ${createdOrder._id} has been successfully placed.`);
    } catch (emailError) {
        console.error("Order email sending failed:", emailError.message || emailError);
    }

    res.status(201).json({ ...createdOrder._doc, message: "Order created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get my orders
const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("user",  "name price email");
        res.json(orders.map(normalizeOrder));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get all orders (admin only)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", " _id name");
        res.json(orders.map(normalizeOrder));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
         
        const order = await Order.findById(orderId);
        if(order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json({ updatedOrder, message: `Order status updated to ${status}` });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus,
};