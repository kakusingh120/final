// controllers/legalAidController.js
import LawyerAddress from '../models/LawyerAddress.js';
import UserAddress from '../models/UserAddress.js';
import { getDistance } from 'geolib';

export const getNearbyLawyers = async (req, res) => {
  try {
    const userId = req.user._id; // from verifyToken

    const userAddress = await UserAddress.findOne({ userId });
    console.log("userAddress:",userAddress)

    if (!userAddress || !userAddress.lat || !userAddress.lng) {
      return res.status(400).json({ message: "User location not found" });
    }

    const allLawyerAddresses = await LawyerAddress.find()
      .populate({
        path: 'lawyerId',
        populate: {
          path: 'userId',
          model: 'User'
        }
      });

      console.log("allLawyerAddresses",allLawyerAddresses)

    const radiusInMeters = 10000; // 10 km

    const nearbyLawyers = allLawyerAddresses.filter(lawyer => {
      if (!lawyer.lat || !lawyer.lng || !lawyer.lawyerId || !lawyer.lawyerId.userId) return false;

      const distance = getDistance(
        { latitude: userAddress.lat, longitude: userAddress.lng },
        { latitude: lawyer.lat, longitude: lawyer.lng }
      );

      return distance <= radiusInMeters;
    });


    console.log("nearbyLawyers",nearbyLawyers)
  
    const result = nearbyLawyers.map(({ lawyerId, street, city, state }) => ({
      _id: lawyerId._id,
      name: lawyerId.userId.fullName,
      specialization: lawyerId.specialization,
      yearsOfExperience: lawyerId.yearsOfExperience,
      rating: lawyerId.rating,
      address: { street, city, state }
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching nearby lawyers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
