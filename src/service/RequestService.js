import RequestModel from "../models/RequestModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create Request
export const CreateRequestService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Add userId from authenticated user (if using auth middleware)
    if (req.headers.user_id || req.cookies.user_id) {
      reqBody.userId = req.headers.user_id || req.cookies.user_id;
    }
    
    const newRequest = new RequestModel(reqBody);
    await newRequest.save();
    
    return { 
      status: true, 
      message: "Blood request created successfully.",
      data: newRequest
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create blood request.", 
      details: e.message 
    };
  }
};

// Get All Requests
export const GetAllRequestsService = async () => {
  try {
    const requests = await RequestModel.find({})
      .populate('userId', 'name email phone profileImage isVerified')
      .populate('fulfilledBy', 'name email phone profileImage isVerified')
      .populate('updatedBy', 'name email phone profileImage role roleSuffix');
    
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
      details: e.message 
    };
  }
};

// Get Request By ID
export const GetRequestByIdService = async (req) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const request = await RequestModel.findById(requestId)
      .populate('userId', 'name email phone profileImage isVerified')
      .populate('fulfilledBy', 'name email phone profileImage isVerified')
      .populate('updatedBy', 'name email phone profileImage role roleSuffix');
    
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
      details: e.message 
    };
  }
};

// Update Request
export const UpdateRequestService = async (req) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const reqBody = req.body;


    // Get user_id from headers or cookie
    const updatedBy = req.headers.user_id || req.cookies.user_id;
    if (!updatedBy) {
      return { status: false, message: "User ID is required." };
    }
    
    reqBody.updatedBy = updatedBy;
    
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { $set: reqBody },
      { new: true }
    )
    
    if (!updatedRequest) {
      return { status: false, message: "Blood request not found or could not be updated." };
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
      details: e.message 
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
      return { status: false, message: "Blood request not found or already deleted." };
    }
    
    return {
      status: true,
      message: "Blood request deleted successfully.",
      data: deletedRequest
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete blood request.", 
      details: e.message 
    };
  }
};

// Get Pending Requests
export const GetPendingRequestsService = async () => {
  try {
    const pendingRequests = await RequestModel.find({ status: 'pending' })
      .populate('userId', 'name email phone');
    
    if (!pendingRequests || pendingRequests.length === 0) {
      return { status: false, message: "No pending blood requests found." };
    }
    
    return {
      status: true,
      data: pendingRequests,
      message: "Pending blood requests retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve pending blood requests.", 
      details: e.message 
    };
  }
};

// Get Fulfilled Requests
export const GetFulfilledRequestsService = async () => {
  try {
    const fulfilledRequests = await RequestModel.find({ status: 'fulfilled' })
      .populate('userId', 'name email phone')
      .populate('fulfilledBy', 'name email phone');
    
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
      details: e.message 
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
      .populate('userId', 'name phone profileImage')
      .populate('fulfilledBy', 'name phone profileImage');
    
    if (!userRequests || userRequests.length === 0) {
      return { status: false, message: "No blood requests found for this user." };
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
      details: e.message 
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
      status: 'pending'
    }).populate('userId', 'name email phone');
    
    if (!requests || requests.length === 0) {
      return { status: false, message: `No pending blood requests found for blood group ${bloodGroup}.` };
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
      details: e.message 
    };
  }
};

// Fulfill Request (Update status and set fulfilledBy)
export const FulfillRequestService = async (req) => {
  try {
    const requestId = new ObjectId(req.params.id);
    const donorId = req.body.fulfilledBy || req.headers.user_id || req.cookies.user_id;

  
    
    if (!donorId || !ObjectId.isValid(donorId)) {
      return { status: false, message: "Valid donor ID is required." };
    }

    //check if request is already fulfilled
    const request = await RequestModel.findById(requestId);
    if (request.status === 'fulfilled') {
      return { status: false, message: "Blood request already fulfilled." };
    }
    
    const fulfilledRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { 
        $set: { 
          status: 'fulfilled',
          fulfilledBy: donorId
        } 
      },
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('fulfilledBy', 'name email phone');
    
    if (!fulfilledRequest) {
      return { status: false, message: "Blood request not found or could not be fulfilled." };
    }
    
    return {
      status: true,
      data: fulfilledRequest,
      message: "Blood request fulfilled successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to fulfill blood request.", 
      details: e.message 
    };
  }
};
