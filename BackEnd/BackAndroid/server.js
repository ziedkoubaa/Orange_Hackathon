// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import User model
const User = require("./models/User");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid." });
  }
};

// Routes
app.get("/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch User Details Error:", error);
    res
      .status(500)
      .json({ message: "Server Error during Fetching User Details." });
  }
});

// Sign Up Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(201)
      .json({ message: "Sign Up Successful.", email: newUser.email, token });
  } catch (error) {
    console.error("Sign Up Error:", error);
    res.status(500).json({ message: "Server Error during Sign Up." });
  }
});

// Sign In Route
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Sign In Successful.",
      email: user.email,
      token,
      userType: user.userType,
    });
  } catch (error) {
    console.error("Sign In Error:", error);
    res.status(500).json({ message: "Server Error during Sign In." });
  }
});

// Assign User Type Route
app.post("/user-type", authenticate, async (req, res) => {
  const { userType } = req.body;

  try {
    // Find user by ID from decoded token
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.userType = userType;
    await user.save();

    res.status(200).json({
      message: "User Type Assigned Successfully.",
      userType: user.userType,
    });
  } catch (error) {
    console.error("Assign User Type Error:", error);
    res
      .status(500)
      .json({ message: "Server Error during User Type Assignment." });
  }
});

// Update Personal Information Route
app.post("/personal-information", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const personalInfo = req.body;

    await User.findByIdAndUpdate(userId, { personalInformation: personalInfo });

    res
      .status(200)
      .json({ message: "Personal Information updated successfully." });
  } catch (error) {
    console.error("Personal Information Update Error:", error);
    res
      .status(500)
      .json({ message: "Server Error during Personal Information Update." });
  }
});

// Add other routes for additional information as needed

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
