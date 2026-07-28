const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({role: 'user'});
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({}).populate('user', 'name email');
    const totalRevenueData = await orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalRevenue = totalRevenueData;

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,   
    });
    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAdminStats,
};
