import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if token is in headers (or cookies)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user to the request
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, token failed");
  }
};
