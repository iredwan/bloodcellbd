import express from "express";
import {
  CreateHospital,
  GetAllHospitals,
  GetHospitalById,
  GetHospitalsByDistrict,
  GetHospitalsByUpazila,
  UpdateHospital,
  DeleteHospital
} from "../controllers/HospitalControllers.js";
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Get all hospitals
router.get("/all", GetAllHospitals);

// Get hospital by ID
router.get("/get/:id", GetHospitalById);

// Get hospitals by district
router.get("/district/:district", GetHospitalsByDistrict);

// Get hospitals by upazila
router.get("/upazila/:upazila", GetHospitalsByUpazila);


// Create a new hospital (Admin only)
router.post("/create", protect, restrictTo("Monitor","Upazila Coordinator", "Upazila Sub-Coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator", "District Coordinator", "District Sub-Coordinator", "District IT & Media Coordinator", "District Logistics Coordinator", "Admin"), CreateHospital);
// Update hospital (Admin only)
router.put("/update/:id", protect, restrictTo("Monitor","Upazila Coordinator", "Upazila Sub-Coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator", "District Coordinator", "District Sub-Coordinator", "District IT & Media Coordinator", "District Logistics Coordinator", "Admin"), UpdateHospital);

// Delete hospital (Admin only)
router.delete("/delete/:id", protect, restrictTo("Monitor","Upazila Coordinator", "Upazila Sub-Coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator", "District Coordinator", "District Sub-Coordinator", "District IT & Media Coordinator", "District Logistics Coordinator", "Admin"), DeleteHospital);

export default router; 