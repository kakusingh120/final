// caseController.js - auto-generated
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.models.js";
import Lawyer from "../models/lawyer.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to fetch lawyers based on the user's city
const getLawyersInCity = asyncHandler(async (req, res) => {
  // Get the user from the request (using middleware to populate the user)
  const user = req.user;

  if (!user.city) {
    throw new ApiError(400, "User city is not specified");
  }

  // Find lawyers in the user's city
  const lawyersInCity = await Lawyer.find({ specialization: user.city });

  if (lawyersInCity.length === 0) {
    throw new ApiError(404, "No lawyers found in your city");
  }

  // Respond with the list of lawyers
  return res.status(200).json(new ApiResponse(200, lawyersInCity, "Lawyers in your city"));
});

export { getLawyersInCity };
