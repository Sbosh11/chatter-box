import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/jwt.js";
import { setTokenCookie } from "../lib/cookie.js";
import { handleError } from "../lib/error.js";

// Utility to return user response
const buildUserResponse = (user, token = null) => ({
  message: token ? "Login successful" : "Profile updated successfully",
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
  },
  ...(token && { token }),
});

// Signup controller
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .send("User with that email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    const token = generateToken(newUser);
    setTokenCookie(res, token);

    res.status(201).json({
      message: "Signup successful",
      ...buildUserResponse(newUser, token),
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Login controller
export const login = async (req, res) => {
  console.log("Login controller called");
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).send("Email/Username and password are required");
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    const responseData = buildUserResponse(user, token);
    console.log("buildUserResponse output:", responseData);

    res.status(200).json(responseData);
  } catch (err) {
    handleError(res, err);
  }
};

// Update profile controller
export const updateProfile = async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    if (!req.user || !req.user.id) {
      return res.status(401).send("Not authenticated");
    }

    res.status(200).json(buildUserResponse(updatedUser));
  } catch (err) {
    handleError(res, err);
  }
};

//Logout controller
export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "Strict" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
};
