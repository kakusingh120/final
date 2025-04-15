// UserAddress.js - auto-generated
import mongoose ,{ Schema,} from "mongoose";

const userAddressSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  street: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  lat: Number,
  lng: Number
});
export default mongoose.model('UserAddress', userAddressSchema);

