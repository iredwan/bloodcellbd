import RequestModel from "../models/RequestModel.js";
import mongoose from "mongoose";
import userModel from "../models/UserModel.js";
const ObjectId = mongoose.Types.ObjectId;

// Create Request
export const CreateRequestService = async (req) => {
  try {
    const reqBody = req.body;

    const userId = req.headers.user_id;

    function generateNumericRequestId(length = 10) {
      let requestId = "";
      for (let i = 0; i < length; i++) {
        requestId += Math.floor(Math.random() * 10);
      }
      return requestId;
    }

    const requestId = generateNumericRequestId(); // e.g. "0394857612"
    reqBody.requestId = requestId;

    if (!userId) {
      return { status: false, message: "User is not authenticated." };
    }

    reqBody.userId = userId;

    const newRequest = new RequestModel(reqBody);
    await newRequest.save();

    return {
      status: true,
      message: "Blood request created successfully.",
      data: { _id: newRequest._id },
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to create blood request.",
      details: e.message,
    };
  }
};

// Get All Requests
export const GetAllRequestsService = async (req, res) => {
  try {
    const getQuery = req.query || {};

    const {
      bloodGroup = "",
      district = "",
      upazila = "",
      userId = "",
      status = "",
    } = getQuery;

    const query = {};

    if (bloodGroup.trim()) query.bloodGroup = bloodGroup.trim();
    if (district.trim()) query.district = district.trim();
    if (upazila.trim()) query.upazila = upazila.trim();
    if (status.trim()) {
      const statuses = status.split(',').map(s => s.trim()).filter(Boolean);
      if (statuses.length > 0) {
        query.status = { $in: statuses };
      }
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.userId = new mongoose.Types.ObjectId(userId);
    }

    const totalRequests = await RequestModel.countDocuments(query);

    const requests = await RequestModel.find(query)
      .populate(
        "userId",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "fulfilledBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "processingBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "updatedBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .sort({ createdAt: -1 });

    if (!requests.length) 
      return{
        status: false,
        message: "No blood requests found.",
        data: [],
        total: 0,
    }

    return {
      status: true,
      message: "Blood requests retrieved successfully.",
      data: requests,
      total: totalRequests,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood requests.",
      details: e.message,
    };
  }
};

// Get All Requests for Admin
export const GetAllRequestsForAdminService = async () => {
  try {
    const requests = await RequestModel.find({})
      .populate(
        "userId",
        "name email name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "fulfilledBy",
        "name email phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "updatedBy",
        "name email phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );
    if (!requests || requests.length === 0) {
      return { status: false, message: "No blood requests found." };
    }
    return {
      status: true,
      data: requests,
      message: "Blood requests retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood requests.",
      details: e.message,
    };
  }
};

// Get Request By ID
export const GetRequestByIdService = async (req) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const request = await RequestModel.findById(requestId)
      .populate(
        "userId",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "processingBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "fulfilledBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "updatedBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );

    if (!request) {
      return { status: false, message: "Blood request not found." };
    }

    return {
      status: true,
      data: request,
      message: "Blood request retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood request.",
      details: e.message,
    };
  }
};

// Update Request
export const UpdateRequestService = async (req) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const reqBody = req.body;
    const processingBy = req.body?.processingBy;
    const fulfilledBy = req.body?.fulfilledBy;

    const existingProcessingRequest = await RequestModel.findOne({
      processingBy: processingBy,
    });

    if (processingBy && processingBy !== existingProcessingRequest.processingBy) {
      reqBody.processingBy = processingBy;
    }

    const existingFulfilledRequest = await RequestModel.findOne({
      fulfilledBy: fulfilledBy,
    });

    if (fulfilledBy && fulfilledBy !== existingFulfilledRequest.fulfilledBy) {
      reqBody.fulfilledBy = fulfilledBy;
    }

    // Get user_id from headers or cookie
    const updatedBy = req.headers?.user_id || req.cookies?.user_id;
    console.log("updatedBy", updatedBy);
    
    if (!updatedBy) {
      return { status: false, message: "User ID is required." };
    }

    reqBody.updatedBy = updatedBy;

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { $set: reqBody },
      { new: true }
    );

    if (!updatedRequest) {
      return {
        status: false,
        message: "Blood request not found or could not be updated.",
      };
    }

    return {
      status: true,
      data: updatedRequest,
      message: "Blood request updated successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update blood request.",
      details: e.message,
    };
  }
};

// Delete Request
export const DeleteRequestService = async (req) => {
  try {
    const requestId = req.params.id;

    if (!ObjectId.isValid(requestId)) {
      return { status: false, message: "Invalid request ID format." };
    }

    const deletedRequest = await RequestModel.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return {
        status: false,
        message: "Blood request not found or already deleted.",
      };
    }

    return {
      status: true,
      message: "Blood request deleted successfully.",
      data: deletedRequest,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to delete blood request.",
      details: e.message,
    };
  }
};

// Get Fulfilled Requests
export const GetFulfilledRequestsService = async () => {
  try {
    const fulfilledRequests = await RequestModel.find({ status: "fulfilled" })
      .populate("userId", "name email phone")
      .populate("fulfilledBy", "name email phone");

    if (!fulfilledRequests || fulfilledRequests.length === 0) {
      return { status: false, message: "No fulfilled blood requests found." };
    }

    return {
      status: true,
      data: fulfilledRequests,
      message: "Fulfilled blood requests retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve fulfilled blood requests.",
      details: e.message,
    };
  }
};

// Get User's Requests (Requested by a specific user)
export const GetUserRequestsService = async (req) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;
    if (!userId || !ObjectId.isValid(userId)) {
      return { status: false, message: "Invalid user ID." };
    }

    const userRequests = await RequestModel.find({ userId: userId })
      .populate("userId", "name phone profileImage")
      .populate("fulfilledBy", "name phone profileImage");

    if (!userRequests || userRequests.length === 0) {
      return {
        status: false,
        message: "No blood requests found for this user.",
      };
    }

    return {
      status: true,
      data: userRequests,
      message: "User's blood requests retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve user's blood requests.",
      details: e.message,
    };
  }
};

// Get Requests by Blood Group
export const GetRequestsByBloodGroupService = async (req) => {
  try {
    const bloodGroup = req.params.bloodGroup;

    if (!bloodGroup) {
      return { status: false, message: "Blood group parameter is required." };
    }

    const requests = await RequestModel.find({
      bloodGroup: bloodGroup,
      status: "pending",
    }).populate("userId", "name email phone");

    if (!requests || requests.length === 0) {
      return {
        status: false,
        message: `No pending blood requests found for blood group ${bloodGroup}.`,
      };
    }

    return {
      status: true,
      data: requests,
      message: `Blood requests for blood group ${bloodGroup} retrieved successfully.`,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood requests by blood group.",
      details: e.message,
    };
  }
};

// Update Request to Processing (Set processingBy user)
export const UpdateRequestToProcessingService = async (req) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const processingBy = req.headers.user_id || req.cookies.user_id;

    if (!processingBy || !ObjectId.isValid(processingBy)) {
      return { status: false, message: "Valid processingBy ID is required." };
    }

    // check if processingBy is on other request
    const existingProcessingRequest = await RequestModel.findOne({
      processingBy: processingBy,
      status: "processing",
    });

    if (existingProcessingRequest) {
      return {
        status: false,
        message: "User is already processing another request.",
      };
    }

    if (!ObjectId.isValid(requestId)) {
      return { status: false, message: "Invalid request ID format." };
    }

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return { status: false, message: "Blood request not found." };
    }

    if (request.status === "processing") {
      return {
        status: false,
        message: "Blood request is already in processing.",
      };
    }

    if (request.status === "fulfilled") {
      return { status: false, message: "Blood request is already fulfilled." };
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "processing",
          processingBy: processingBy,
        },
      },
      { new: true }
    );

    if (!updatedRequest) {
      return {
        status: false,
        message: "Blood request not found or could not be updated.",
      };
    }

    return {
      status: true,
      data: updatedRequest,
      message: "Blood request updated to processing successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update blood request to processing.",
      details: e.message,
    };
  }
};

// Get Requests by ProcessingBy (Get requests being processed by a specific user)
export const GetRequestsByProcessingByService = async (req) => {
  try {
    const processingBy = req.headers.user_id || req.cookies.user_id;

    if (!processingBy || !ObjectId.isValid(processingBy)) {
      return { status: false, message: "Invalid processingBy ID." };
    }
    const processingRequestsData = await RequestModel.find({ processingBy: processingBy })
      .populate("userId", "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage")
      .populate("processingBy", "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage");

    if (!processingRequestsData || processingRequestsData.length === 0) {
      return {
        status: false,
        message: "No blood requests found being processed by this user.",
      };
    }

    return {
      status: true,
      data: processingRequestsData,
      message:
        "Blood requests being processed by this user retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood requests by processingBy.",
      details: e.message,
    };
  }
};

// Remove ProcessingBy (Set processingBy to null)
export const RemoveProcessingByService = async (req) => {
  try {
    const processingByID = new ObjectId(req.params.id);
    

    if (!ObjectId.isValid(processingByID)) {
      return { status: false, message: "Invalid request ID format." };
    }

    // Get user_id from headers or cookie
    const updatedBy = req.headers.user_id || req.cookies.user_id;
    if (!updatedBy) {
      return { status: false, message: "User ID is required." };
    }

    const request = await RequestModel.findOne({processingBy: processingByID});

    if (!request) {
      return { status: false, message: "Blood request not found." };
    }

    if (request.status !== "processing") {
      return {
        status: false,
        message: "Blood request is not in processing.",
      };
    }

    const updatedRequest = await RequestModel.findOneAndUpdate(
      {processingBy: processingByID},
      {
        $set: {
          processingBy: null,
          status: "pending",
          updatedBy: updatedBy
        },
      },
      { new: true }
    );

    if (!updatedRequest) {
      return {
        status: false,
        message: "Blood request not found or could not be updated.",
      };
    }

    return {
      status: true,
      data: updatedRequest,
      message: "ProcessingBy removed successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to remove processingBy1.",
      details: e.message,
    };
  }
  };

// Fulfill Request (Update status and set fulfilledBy)
export const FulfillRequestService = async (req, res) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const donorId =
      req.headers.user_id || req.cookies.user_id || req.body.fulfilledBy;

    if (!donorId || !ObjectId.isValid(donorId)) {
      return { status: false, message: "Valid donor ID is required." };
    }

    console.log("Request ID:", requestId);
    console.log("Donor ID:", donorId);

    //check if request is already fulfilled
    const request = await RequestModel.findById(requestId);
    if (request.status === "fulfilled") {
      return { status: false, message: "Blood request already fulfilled." };
    }

    const fulfilledRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "fulfilled",
          processingBy: null,
          fulfilledBy: donorId,
        },
      },
      { new: true }
    );

    if (!fulfilledRequest) {
      return {
        status: false,
        message: "Blood request not found or could not be fulfilled.",
      };
    }

    // Change the donor's last donation date
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const updateResult = await userModel.updateOne(
      { _id: donorId },
      { $set: { lastDonate: formattedDate } }
    );

    return {
      status: true,
      data: fulfilledRequest,
      message: "Blood request fulfilled successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to fulfill blood request.",
      details: e.message,
    };
  }
};

// Get Requests by fulfilledBy (Get requests fulfilled by a specific user)
export const GetRequestsFulfilledByService = async (req) => {
  try {
    const fulfilledById = req.headers.user_id || req.cookies.user_id;

    if (!fulfilledById || !ObjectId.isValid(fulfilledById)) {
      return { status: false, message: "Invalid fulfilledBy ID." };
    }

    const requests = await RequestModel.find({ fulfilledBy: fulfilledById })
      .populate("userId", "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage")
      .populate("fulfilledBy", "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage");

    if (!requests || requests.length === 0) {
      return {
        status: false,
        message: "No blood requests found for this user.",
      };
    }

    return {
      status: true,
      data: requests,
      message: "Blood requests fulfilled by this user retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve blood requests by fulfilledBy.",
      details: e.message,
    };
  }
};

// Cancel Request (Update status and set updatedBy)
export const CancelRequestService = async (req, res) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const updatedBy = req.headers.user_id || req.cookies.user_id;

    if (!updatedBy || !ObjectId.isValid(updatedBy)) {
      return { status: false, message: "Valid updatedBy ID is required." };
    }

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return { status: false, message: "Blood request not found." };
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "cancelled",
          updatedBy: updatedBy,
        },
      },
      { new: true }
    );

    if (!updatedRequest) {
      return {
        status: false,
        message: "Blood request not found or could not be cancelled.",
      };
    }

    return {
      status: true,
      data: updatedRequest,
      message: "Blood request cancelled successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to cancel blood request.",
      details: e.message,
    };
  }
};


// Reject Request (Update status and set updatedBy)
export const RejectRequestService = async (req, res) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const updatedBy = req.headers.user_id || req.cookies.user_id;

    if (!updatedBy || !ObjectId.isValid(updatedBy)) {
      return { status: false, message: "Valid updatedBy ID is required." };
    }

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return { status: false, message: "Blood request not found." };
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "rejected",
          updatedBy: updatedBy,
        },
      },
      { new: true }
    );

    if (!updatedRequest) {
      return {
        status: false,
        message: "Blood request not found or could not be rejected.",
      };
    }

    return {
      status: true,
      data: updatedRequest,
      message: "Blood request rejected successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to reject blood request.",
      details: e.message,
    };
  }
};