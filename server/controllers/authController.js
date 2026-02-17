const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
=========================================
GENERATE JWT TOKEN
=========================================
*/
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/*
=========================================
REGISTER USER
=========================================
POST /api/auth/register
*/
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=========================================
LOGIN USER
=========================================
POST /api/auth/login
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send response (IMPORTANT FOR DAY 22)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ REQUIRED
      token,            // ✅ REQUIRED
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
