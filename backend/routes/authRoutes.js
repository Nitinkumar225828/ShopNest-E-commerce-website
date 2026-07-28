const express = require("express");
const router = express.Router();
const { admin } = require("../middleware/adminmiddleware");
const { protect } = require("../middleware/authmiddleware");
const { userRegister, loginUser, logoutUser, getUsers } = require("../controllers/authController");

router.post("/register", userRegister);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", protect, admin, getUsers);

module.exports = router;

