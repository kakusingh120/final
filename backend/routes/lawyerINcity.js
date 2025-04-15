import express from "express";
import { getLawyersInCity } from "../controllers/getLawyersInCity.js";
import { protect } from "../middlewares/cityFind.js"; // assuming you have an auth middleware

const router = express.Router();

// Route to get lawyers in the user's city
router.get("/profile/lawyers", protect, getLawyersInCity);

export default router;
