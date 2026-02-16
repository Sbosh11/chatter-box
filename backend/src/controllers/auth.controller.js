import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import { generateToken } from "../lib/jwt.js";
import { setTokenCookie } from "../lib/cookie.js";
import { handleError } from "../lib/error.js";
import sendEmail from "../lib/sendEmail.js";

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
/** 
// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const user = await User.findOne({ email });

    // Do NOT reveal if email exists
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link was sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // TEMP: log instead of email
    console.log("Password reset URL:", resetUrl);

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    handleError(res, err);
  }
};**/
/** Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const user = await User.findOne({ email });

    // Do NOT reveal if email exists
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link was sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const isDev = process.env.NODE_ENV !== "production";

    // DEV: return reset URL | PROD: hide it
    res.json({
      message: "Password reset link generated",
      ...(isDev && { resetUrl }),
    });
  } catch (err) {
    handleError(res, err);
  }
};**/

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const user = await User.findOne({ email });

    // Do NOT reveal if email exists
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link was sent" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const isDev = process.env.NODE_ENV !== "production";

    // =========================
    // DEV MODE → RETURN LINK
    // =========================
    if (isDev) {
      return res.json({
        message: "Password reset link generated (DEV)",
        resetUrl,
      });
    }

    // =========================
    // PROD MODE → SEND EMAIL
    // =========================
    const htmlMessage = `
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>Click the link below:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your ChatterBox password",
      html: htmlMessage,
    });

    res.json({
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).send("Password is required");
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Token invalid or expired");
    }

    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
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
