import express from "express";
import {
  CreateEvent,
  GetAllEvents,
  GetEventById,
  UpdateEvent,
  DeleteEvent,
  GetUpcomingEvents,
  GetCompletedEvents,
} from "../controllers/EventControllers.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Get events with filters and pagination
router.get("/all", GetAllEvents);

// Get upcoming events (paginated)
router.get("/upcoming", GetUpcomingEvents);

// Get completed events (paginated)
router.get("/completed", GetCompletedEvents);

// Get event details by ID
router.get("/get/:id", GetEventById);

// Create a new event (with image upload)
router.post(
  "/create",
  protect,
  restrictTo("Upazila Coordinator", "Upazila Co-coordinator", "District Coordinator", "District Co-coordinator", "Admin"),
  CreateEvent
);

// Update an existing event (with image upload)
router.patch(
  "/update/:id",
  protect,
  restrictTo("Upazila Coordinator", "Upazila Co-coordinator", "District Coordinator", "District Co-coordinator", "Admin"),
  UpdateEvent
);

// Delete an event
router.delete(
  "/delete/:id",
  protect,
  restrictTo("Upazila Coordinator", "Upazila Co-coordinator", "District Coordinator", "District Co-coordinator", "Admin"),
  DeleteEvent
);

export default router;
