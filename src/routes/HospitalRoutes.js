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

// Create a new hospital (Admin only)
router.post("/create", protect, restrictTo("admin",), CreateHospital);

// Get all hospitals
router.get("/all", GetAllHospitals);

// Get hospital by ID
router.get("/get/:id", GetHospitalById);

// Get hospitals by district
router.get("/district/:district", GetHospitalsByDistrict);

// Get hospitals by upazila
router.get("/upazila/:upazila", GetHospitalsByUpazila);

// Update hospital (Admin only)
router.put("/update/:id", protect, restrictTo("volunteer", "dist-coordinator","admin"), UpdateHospital);

// Delete hospital (Admin only)
router.delete("/delete/:id", protect, restrictTo("volunteer", "dist-coordinator","admin"), DeleteHospital);

export default router; 