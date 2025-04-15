import mongoose, { Schema } from "mongoose";

const lawyerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    specialization: { type: String, required: true },
    barRegistrationNumber: { type: String, required: true, unique: true },
    yearsOfExperience: { type: Number, required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    avatar: { type: String }, 
    gender:{type:String},
    requests: [
      {
        clientName: String,
        message: String,
        userId: mongoose.Schema.Types.ObjectId,
        createdAt: Date
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Lawyer', lawyerSchema);
