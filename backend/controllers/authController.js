const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

  const generateToken = (user) => {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
    return token;
  }

const userRegister = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    const userName = username || name;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username: userName }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: userName,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

      const message = `Welcome to ShopNest, ${userName} Your OTP for registration is: ${otp}. It will expire in 10 minutes.`;

      try {
          await sendEmail(email, "ShopNest Registration OTP", message);
          } catch (emailError) {
          console.error("Email Error:", emailError.message);
          }

res.status(201).json({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  message: "User registered successfully.",
  token: generateToken(user)
});
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }

    // res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
// login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user),
        message: "User logged in successfully"
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
    // res.status(200).json({ message: "User logged in successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Invalidate the token on the client side by removing it from local storage or cookies
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the response
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { userRegister, loginUser, logoutUser, getUsers };
