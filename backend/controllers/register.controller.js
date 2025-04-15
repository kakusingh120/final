import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deletefromCloudinary } from "../utils/cloudinary.js";
import Lawyer from "../models/lawyer.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// =================== TOKEN GENERATION ===================
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found for token generation");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// =================== REGISTER USER ===================
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password ,gender} = req.body;

  if ([email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(401, "User already exists");
  }

  try {
    const user = await User.create({
      email,
      password,
      username: username.toLowerCase(),
      role: "user",
      gender
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered."));
  } catch (err) {
    throw new ApiError(500, "User registration failed.");
  }
});

// =================== LOGIN USER ===================
const loginUserOnly = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) throw new ApiError(400, "Email or Username is required");

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  console.log("user", user);
  if (!user || user.role !== 'user') throw new ApiError(404, "User not found or invalid role");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const userData = await User.findById(user._id).select("-password -refreshToken");

  // Set the cookies for access and refresh tokens
  res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }) // Use httpOnly for security
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }) // Use httpOnly for security
    .json(new ApiResponse(200, { user: userData, accessToken, refreshToken }, "User logged in"));

  
});




// =============login as lawyer only======

const loginLawyerOnly = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) throw new ApiError(400, "Email or Username is required");

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user || user.role !== 'lawyer') throw new ApiError(404, "Lawyer not found or invalid role");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const userData = await User.findById(user._id).select("-password -refreshToken");

  const lawyerData = await Lawyer.findOne({ userId: user._id });
  userData.lawyer = lawyerData;

  res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, { user: userData, accessToken, refreshToken }, "Lawyer logged in"));
});




// export const loginLawyerOnly = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).render("login/login", { error: "Invalid credentials" });
//     }

//     // Prepare payload for token
//     const payload = {
//       _id: user._id,
//       email: user.email,
//       username: user.username,
//     };

//     // Sign the token
//     const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: "1d",
//     });

//     // Send token as httpOnly cookie
//     res.cookie("accessToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // true in production
//       sameSite: "Lax",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).render("login/login", { error: "Something went wrong" });
//   }
// };



// =================== FORGOT PASSWORD ===================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = user.getResetPasswordToken(); // Get reset token
  console.log("Generated Reset Token:", resetToken); // Log to verify token is generated
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:8001/reset-password/${resetToken}`;
  const message = `You requested a password reset. Click to reset: ${resetUrl}`;

  try {
    console.log("Email message content:", message); // Log the message content
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Email could not be sent");
  }
});


// =================== RESET PASSWORD ===================
const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password reset successful"));
});

// =================== REFRESH ACCESS TOKEN ===================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized User");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token mismatch");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid Refresh Token");
  }
});

// =================== LOGOUT ===================
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req?.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// =================== UPDATE PASSWORD ===================
const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password updated"));
});

// =================== UPDATE ACCOUNT ===================
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

export {
  registerUser,
  loginLawyerOnly,
  loginUserOnly,
  logout,
  refreshAccessToken,
  updateUserPassword,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
};
