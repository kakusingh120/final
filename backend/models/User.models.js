import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type } from "os";
import { stringify } from "querystring";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
 
  fullName: { type: String }, 
  avatar: { type: String },
  coverImage: { type: String },
  avatar: { type: String }, 
  city:{type: String},
  role:{
    type:String
  },gender:{type:String},
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next(); 
});

// Compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password || !this.password) {
    throw new Error('Password or hashed password is missing');
  }
  return await bcrypt.compare(String(password), String(this.password));
};

// Generate access & refresh tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to resetPasswordToken
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set the expiration time (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('User', userSchema);
