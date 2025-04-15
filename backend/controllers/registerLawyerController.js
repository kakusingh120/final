
import { User } from "../models/User.models.js";
import { Lawyer } from "../models/lawyer.js";
import { uploadOnCloudinary, deletefromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import {asynchandler}from "../utils/AsyncHandeler.js"

export const registerLawyer = asynchandler(async (req, res) => {
  const {
    username,
    email,
    password,
    specialization,
    yearsOfExperience,
    barRegistrationNumber,
    gender
  } = req.body;

  if (
    [email, username, password, specialization, yearsOfExperience, barRegistrationNumber].some(
      (field) => !field?.trim()
    )
  ) {
    throw new ApiError(400, "All fields are required for lawyer registration.");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(401, "User already exists");
  }

  // Avatar Upload
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed.");
  }

  try {
    const user = await User.create({
      email,
      password,
      username: username.toLowerCase(),
      role: "lawyer",
      gender,
      avatar: avatar.url
    });

    await Lawyer.create({
        userId: user._id,
        username: username.toLowerCase(),
        specialization,
        barRegistrationNumber,
        yearsOfExperience,
        gender,
        avatar: avatar?.url || "",  // Save avatar URL
        rating: 0,
      });


    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
      new ApiResponse(200, createdUser, "Lawyer registered successfully.")
    );
  } catch (error) {
    // Cleanup uploaded avatar in case of error
    if (avatar) {
      await deletefromCloudinary(avatar.public_id);
    }
    console.error("Error during lawyer registration:", error);
    throw new ApiError(500, "Lawyer registration failed.");
  }
});
