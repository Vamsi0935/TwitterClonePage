import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

// Function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, "vamsikrishnad", {
    expiresIn: "1h",
  });
};

// User Signup Function
export const signupUser = async (req, res, next) => {
  try {
    const { fullName, userName, email, phoneNumber, birthDate, password } =
      req.body;

    // Check for missing fields
    if (!userName || userName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "userName is required.",
      });
    }
    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }
    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    // Check for existing user by email or userName
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      const errorField = existingUser.email === email ? "email" : "userName";
      return res.status(400).json({
        success: false,
        message: `${
          errorField.charAt(0).toUpperCase() + errorField.slice(1)
        } is already taken.`,
      });
    }

    // Hash the password and create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      userName,
      email,
      phoneNumber,
      birthDate,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists.`,
      });
    }

    next(error);
  }
};

// User Signin Function
export const signinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(existingUser._id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      userName: existingUser.userName,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// User Signout Function
export const signoutUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User logged out successfully.",
  });
};

// Get All Users Function
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password from the response
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
