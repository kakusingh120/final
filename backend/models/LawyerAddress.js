// LawyerAddress.js - auto-generated
import mongoose ,{ Schema,} from "mongoose";

const lawyerAddressSchema = new Schema({
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  username: { type: String },
  street: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  lat: Number,
  lng: Number
});

export default mongoose.model('LawyerAddress', lawyerAddressSchema);
