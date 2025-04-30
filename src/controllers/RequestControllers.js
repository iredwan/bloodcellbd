import { 
  CreateRequestService, 
  GetAllRequestsService, 
  GetRequestByIdService, 
  UpdateRequestService, 
  DeleteRequestService, 
  GetPendingRequestsService, 
  GetFulfilledRequestsService, 
  GetUserRequestsService, 
  GetRequestsByBloodGroupService, 
  FulfillRequestService
} from "../service/RequestService.js";

// Create Blood Request
export const CreateRequest = async (req, res) => {
  try {
    const result = await CreateRequestService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error creating blood request", error: error.message });
  }
};

// Get All Blood Requests
export const GetAllRequests = async (req, res) => {
  try {
    const result = await GetAllRequestsService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error retrieving blood requests", error: error.message });
  }
};

// Get Blood Request By ID
export const GetRequestById = async (req, res) => {
  try {
    const result = await GetRequestByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error retrieving blood request", error: error.message });
  }
};

// Update Blood Request
export const UpdateRequest = async (req, res) => {
  try {
    const result = await UpdateRequestService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error updating blood request", error: error.message });
  }
};

// Delete Blood Request
export const DeleteRequest = async (req, res) => {
  try {
    const result = await DeleteRequestService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error deleting blood request", error: error.message });
  }
};

// Get Pending Blood Requests
export const GetPendingRequests = async (req, res) => {
  try {
    const result = await GetPendingRequestsService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error retrieving pending blood requests", error: error.message });
  }
};

// Get Fulfilled Blood Requests
export const GetFulfilledRequests = async (req, res) => {
  try {
    const result = await GetFulfilledRequestsService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error retrieving fulfilled blood requests", error: error.message });
  }
};

// Get User's Blood Requests
export const GetUserRequests = async (req, res) => {
  try {
    const result = await GetUserRequestsService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error retrieving user's blood requests", error: error.message });
  }
};

// Get Blood Requests by Blood Group
export const GetRequestsByBloodGroup = async (req, res) => {
  try {
    const result = await GetRequestsByBloodGroupService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error retrieving blood requests by blood group", error: error.message });
  }
};

// Fulfill Blood Request
export const FulfillRequest = async (req, res) => {
  try {
    const result = await FulfillRequestService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error fulfilling blood request", error: error.message });
  }
}; 