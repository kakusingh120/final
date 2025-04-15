import UserAddress from '../models/UserAddress.js';

export const saveUserAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { street, city, state, country, postalCode, lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const address = await UserAddress.findOneAndUpdate(
      { userId },
      { street, city, state, country, postalCode, lat, lng },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Address saved successfully', address });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
