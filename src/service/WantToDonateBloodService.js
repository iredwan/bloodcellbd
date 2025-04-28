import WantToDonateBlood from "../models/WantToDonateBloodModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


export const CreateWantToDonateBloodService = async (req) => {
  try {
    const reqBody = req.body;

    const bloodDonorUserId = req.body.bloodDonorUserId || req.headers.user._id|| req.cookies.user._id;
    
    // Validate required fields
    if (!bloodDonorUserId || !reqBody.date || !reqBody.district || !reqBody.upazila) {
      return {
        status: false,
        message: "Blood donor user ID, date, district, and upazila are required."
      };
    }

    reqBody.bloodDonorUserId = bloodDonorUserId;
    
    // Create new donation request
    const newDonationRequest = new WantToDonateBlood(reqBody);
    
    await newDonationRequest.save();
    
    return {
      status: true,
      message: "Blood donation request created successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to create blood donation request.",
      details: e.message
    };
  }
};


export const GetAllWantToDonateBloodService = async () => {
  try {
    // Get donation requests with filters
    const donationRequests = await WantToDonateBlood.find({})
      .populate("bloodDonorUserId", "name phone bloodGroup smoking isVerified profileImage lastDonate")
      .populate("bloodCollectedBy", "name phone profileImage") 
      .populate("updatedBy", "name phone role roleSuffix profileImage")
      .sort({ createdAt: -1 });

    if (!donationRequests || donationRequests.length === 0) {
      return {
        status: false,
        message: "No blood donation requests found."
      };
    }

    return {
      status: true,
      message: "Blood donation requests retrieved successfully.",
      data: donationRequests
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood donation requests.",
      details: e.message
    };
  }
};


export const GetWantToDonateBloodByIdService = async (req) => {
  try {
    const donationRequestId = new ObjectId(req.params.id);
    
    if (!ObjectId.isValid(donationRequestId)) {
      return {
        status: false,
        message: "Invalid blood donation request ID."
      };
    }
    
    const donationRequest = await WantToDonateBlood.findById(donationRequestId)
      .populate("bloodDonorUserId", "name phone bloodGroup smoking isVerified profileImage lastDonate")
      .populate("bloodCollectedBy", "name phone profileImage")
      .populate("updatedBy", "name phone role roleSuffix profileImage");
    
    if (!donationRequest) {
      return {
        status: false,
        message: "Blood donation request not found."
      };
    }
    
    return {
      status: true,
      message: "Blood donation request retrieved successfully.",
      data: donationRequest
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood donation request.",
      details: e.message
    };
  }
};


export const UpdateWantToDonateBloodService = async (req) => {
  try {
    const donationRequestId = new ObjectId(req.params.id);
    const updateData = req.body;
    
    if (!ObjectId.isValid(donationRequestId)) {
      return {
        status: false,
        message: "Invalid blood donation request ID."
      };
    }
    
    // Add updater info
    updateData.updatedBy = req.headers.user_id || req.cookies.user_id;
    
    const donationRequest = await WantToDonateBlood.findByIdAndUpdate(
      donationRequestId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    
    if (!donationRequest) {
      return {
        status: false,
        message: "Blood donation request not found."
      };
    }
    
    return {
      status: true,
      message: "Blood donation request updated successfully.",
      data: donationRequest
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update blood donation request.",
      details: e.message
    };
  }
};

// Update Blood Collected By
export const UpdateBloodCollectedByService = async (req) => {
  try {
    const donationRequestId = new ObjectId(req.params.id);
    const collectorId = req.body.bloodCollectedBy || req.headers.user_id || req.cookies.user_id;

    if (!collectorId || !ObjectId.isValid(collectorId)) {
      return { status: false, message: "Valid collector ID is required." };
    }

    if (!ObjectId.isValid(donationRequestId)) {
      return { status: false, message: "Invalid blood donation request ID." };
    }

    // Check if donation request is already collected
    const donationRequest = await WantToDonateBlood.findById(donationRequestId);
    if (donationRequest.status === 'collected') {
      return { status: false, message: "Blood donation already collected." };
    }

    const collectedDonation = await WantToDonateBlood.findByIdAndUpdate(
      donationRequestId,
      { 
        $set: { 
          status: 'collected',
          bloodCollectedBy: collectorId,
        } 
      },
      { new: true }
    )

    if (!collectedDonation) {
      return { status: false, message: "Blood donation request not found or could not be collected." };
    }

    return {
      status: true,
      data: collectedDonation,
      message: "Blood collected successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update blood collection status.", 
      details: e.message 
    };
  }
};


export const DeleteWantToDonateBloodService = async (req) => {
  try {
    const donationRequestId = new ObjectId(req.params.id);
    
    if (!ObjectId.isValid(donationRequestId)) {
      return {
        status: false,
        message: "Invalid blood donation request ID."
      };
    }
    
    const donationRequest = await WantToDonateBlood.findByIdAndDelete(donationRequestId);
    
    if (!donationRequest) {
      return {
        status: false,
        message: "Blood donation request not found or already deleted."
      };
    }
    
    return {
      status: true,
      message: "Blood donation request deleted successfully.",
      data: donationRequest
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to delete blood donation request.",
      details: e.message
    };
  }
};
