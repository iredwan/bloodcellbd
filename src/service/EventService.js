import Event from "../models/EventModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create a new event
export const CreateEventService = async (req) => {
  try {
    const eventData = req.body;

    const generateUniqueEventID = async () => {
      let eventID;
      let exists = true;
    
      while (exists) {
        eventID = Math.floor(10000 + Math.random() * 90000);
        // Replace this with actual DB check
        exists = await Event.exists({ eventID });
      }
    
      return eventID;
    };
    
    // ব্যবহার:
    eventData.eventID = await generateUniqueEventID();
    
    
    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date || !eventData.time || 
        !eventData.upazila || !eventData.district) {
      return { 
        status: false, 
        message: "Missing required fields. Please provide title, description, date, time, upazila, and district." 
      };
    }

    // Check if the event is already created
    const existingEvent = await Event.findOne({
      date: eventData.date,
      district: eventData.district,
      upazila: eventData.upazila
    });
    if (existingEvent) {
      return {
        status: false,
        message: "An event already exists in this location at this date."
      };
    }
    // Set creator/updater information
    const userId = req.headers.user_id || req.cookies.user_id;
    if (userId) {
      eventData.createdBy = userId;
    }
    
    // Create new event
    const newEvent = new Event(eventData);
    await newEvent.save();
    
    // Return just the new event without population since Upazila model isn't registered
    return { 
      status: true, 
      message: "Event created successfully.",
      data: newEvent
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create event.", 
      details: e.message 
    };
  }
};

// Get all events with filters and pagination
export const GetAllEventsService = async (req = {}) => {
  try {
    // Extract pagination parameters from req.query or set defaults
    const page = parseInt(req.query?.page, 10) > 0 ? parseInt(req.query.page, 10) : 1;
    const limit = parseInt(req.query?.limit, 10) > 0 ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by status if provided
    if (req.query?.status) {
      filter.status = req.query.status;
    }

    // Search by title or status if search query provided
    if (req.query?.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { eventID: searchRegex },
        { title: searchRegex },
        { status: searchRegex }
      ];
    }

    // Get total count for pagination (with filters)
    const totalCount = await Event.countDocuments(filter);

    // Get events with pagination, sorting, and filters
    const events = await Event.find(filter)
    .populate(
      "organizer",
      "name logo sponsorType coverImage website description contactPerson"
    )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!events || events.length === 0) {
      return { 
        status: false, 
        message: "No events found matching your criteria." 
      };
    }

    return {
      status: true,
      data: events,
      pagination: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalCount: totalCount
      },
      message: "Events retrieved successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve events.", 
      details: e.message 
    };
  }
};

// Get event by ID
export const GetEventByIdService = async (req) => {
  try {
    const eventId = req.params.id;
    
    if (!ObjectId.isValid(eventId)) {
      return { status: false, message: "Invalid event ID format." };
    }
    
    const event = await Event.findById(eventId)
      .populate(
        "organizer",
        "name logo sponsorType coverImage website description contactPerson"
      )
      .populate(
        "createdBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "updatedBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );
    
    if (!event) {
      return { status: false, message: "Event not found." };
    }
    
    return {
      status: true,
      data: event,
      message: "Event retrieved successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve event.", 
      details: e.message 
    };
  }
};

// Update event
export const UpdateEventService = async (req) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;
    
    if (!ObjectId.isValid(eventId)) {
      return { status: false, message: "Invalid event ID format." };
    }
    
    // Check if current event exists
    const currentEvent = await Event.findById(eventId);
    
    if (!currentEvent) {
      return { status: false, message: "Event not found." };
    }
    
 
    const userId = req.headers.user_id || req.cookies.user_id;
    
    // Set updatedBy field
    if (userId) {
      updateData.updatedBy = userId;
    }
    
    // Only check if both old and new image arrays exist
if (Array.isArray(updateData.image) && Array.isArray(currentEvent.image)) {
  const removedImages = currentEvent.image.filter(
    (img) => !updateData.image.includes(img)
  );

  for (const img of removedImages) {
    try {
      const fileName = path.basename(img);
      await deleteFile(fileName);
    } catch (err) {
      console.warn(`Failed to delete image ${img}:`, err.message);
    }
  }
}

    
    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    return {
      status: true,
      data: updatedEvent,
      message: "Event updated successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update event.", 
      details: e.message 
    };
  }
};

// Delete event
export const DeleteEventService = async (req) => {
  try {
    const eventId = req.params.id;
    
    if (!ObjectId.isValid(eventId)) {
      return { status: false, message: "Invalid event ID format." };
    }
    
    // Get event before deletion
    const event = await Event.findById(eventId);
    
    if (!event) {
      return { status: false, message: "Event not found or already deleted." };
    }
    
    // Check if user has permission to delete this event
    const userId = req.headers.user_id || req.cookies.user_id;
    const userRole = req.headers.role || req.user?.role;
    
    if (userRole !== 'Admin' && 
        userId !== event.organizer.toString() && 
        userId !== event.createdBy?.toString()) {
      return { 
        status: false, 
        message: "You don't have permission to delete this event." 
      };
    }
    
    // Delete the image file if it exists
    if (event.image) {
      const fileName = path.basename(event.image);
      await deleteFile(fileName);
    }
    
    // Delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    
    return {
      status: true,
      message: "Event deleted successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete event.", 
      details: e.message 
    };
  }
};

// Get upcoming events (public)
export const GetUpcomingEventsService = async () => {
  try {
   
    
    // Get upcoming events
    const upcomingEvents = await Event.find(
      {
        status: 'upcoming',
      }
    )
      .sort({ date: 1 })
      .populate(
        "createdBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "updatedBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );
    
    if (!upcomingEvents || upcomingEvents.length === 0) {
      return { 
        status: false, 
        message: "No upcoming events found." 
      };
    }
    
    return {
      status: true,
      data: upcomingEvents,
      message: "Upcoming events retrieved successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve upcoming events.", 
      details: e.message 
    };
  }
};

// Get completed events
export const GetCompletedEventsService = async () => {
  try {
    // Get completed events
    const completedEvents = await Event.find({ status: 'Completed' }) 
      .sort({ date: -1 })
      .populate(
        "createdBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      )
      .populate(
        "updatedBy",
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );

    if (!completedEvents || completedEvents.length === 0) {
      return { 
        status: false, 
        message: "No completed events found." 
      };
    }

    return {
      status: true,
      data: completedEvents,
      message: "Completed events retrieved successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve completed events.", 
      details: e.message 
    };
  }
};

