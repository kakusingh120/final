// lawyerController.js - auto-generated
import LawyerAddress from '../models/LawyerAddress.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import lawyer from '../models/lawyer.js';

// Controller to save the lawyer's address
export const saveLawyerAddress = asyncHandler(async (req, res) => {
  // Get the logged-in lawyer's userId from the request (from JWT)
  const userId = req.user._id; 

  // Get the address details from the request body
  const { street, city, state, country, postalCode, lat, lng } = req.body;

  // Check if all required fields are provided
  if (!street || !city || !state || !country || !postalCode || !lat || !lng) {
    throw new ApiError(400, "All fields are required.");
  }

  const Lawyer = await lawyer.findOne({ userId });

  // Create and save the lawyer address
  const newLawyerAddress = new LawyerAddress({
    lawyerId: Lawyer._id,
    street,
    city,
    state,
    country,
    postalCode,
    lat,
    lng
  });

  await newLawyerAddress.save();

  return res.status(201).json({
    status: "success",
    message: "Lawyer address saved successfully",
    data: newLawyerAddress
  });
});
