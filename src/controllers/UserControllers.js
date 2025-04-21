import { UserRegisterService, UserLoginService, UserLogoutService, GetUserByIdService, UpdateUserByIdService, GetAllUserService, EligibleUserService, DeleteUserService, GetUserByBloodGroupService, GetUserByUpazilaService, GetPendingUserService, GetApprovedUserService, GetBannedUserService, GetUserByDistrictService, GetUserByNameService } from "../service/UserService.js";

// Profile Register
export const ProfileRegister = async (req, res) => {
  try {
    const result = await UserRegisterService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Profile Login
export const ProfileLogin = async (req, res) => {
  try {
    const result = await UserLoginService(req, res);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Login failed", error: error.message });
  }
};

// Profile Logout
export const ProfileLogout = async (req, res) => {
  try {
    const result = await UserLogoutService(req, res);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get User By Id
export const GetUserById = async (req, res) => {
  try {
    const result = await GetUserByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update User By Id
export const UpdateUserById = async (req, res) => {
  try {
    const result = await UpdateUserByIdService(req);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

// Get All User
export const GetAllUser = async (req, res) => { 
  try {
    const result = await GetAllUserService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eligible User
export const EligibleUser = async (req, res) => {
  try {
    const result = await EligibleUserService();
    return res.status(200).json(result);    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete User  
export const DeleteUser = async (req, res) => {
  try {
    const result = await DeleteUserService(req);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

// Get User By Blood Group
export const GetUserByBloodGroup = async (req, res) => {
  try {
    const result = await GetUserByBloodGroupService(req);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

// Get User By District
export const GetUserByDistrict = async (req, res) => {
  try {
    const result = await GetUserByDistrictService(req);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

// Get User By Upazila
export const GetUserByUpazila = async (req, res) => {
  try {
    const result = await GetUserByUpazilaService(req);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

// Get Pending User
export const GetPendingUser = async (req, res) => {
  try {
    const result = await GetPendingUserService();
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};

// Get Approved User
export const GetApprovedUser = async (req, res) => {
  try {
    const result = await GetApprovedUserService();
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};  

// Get Banned User
export const GetBannedUser = async (req, res) => {
  try {
    const result = await GetBannedUserService();
    return res.status(200).json(result);
  } catch (error) {  
    return res.status(500).json({ error: error.message });
  }
};

// Get User By Name
export const GetUserByName = async (req, res) => {
  try {
    const result = await GetUserByNameService(req);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({ error: error.message });
  }
};







