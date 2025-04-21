import Event from "../models/EventModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create a new event
export const CreateEventService = async (req) => {
  try {
    const eventData = req.body;
    
    // If admin is creating the event, use the organizer ID from the body
    // If organizer is creating the event, use their ID from auth
    if (!eventData.organizer && req.headers.user_id) {
      eventData.organizer = req.headers.user_id;
    }
    
    // Create new event
    const newEvent = new Event(eventData);
    await newEvent.save();
    
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

// Get all events
export const GetAllEventsService = async (req) => {
  try {
    const { status, from, to, organizer } = req.query;
    
    // Build filter object based on query parameters
    const filter = {};
    
    // Filter by status if provided
    if (status && ['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }
    
    // Filter by date range if provided
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    
    // Filter by organizer if provided
    if (organizer && ObjectId.isValid(organizer)) {
      filter.organizer = new ObjectId(organizer);
    }
    
    // Get events with filters, sort by date, and populate organizer
    const events = await Event.find(filter)
      .sort({ date: 1 }) // Sort by date ascending (upcoming first)
      .populate('organizer', 'name email phone');
    
    if (!events || events.length === 0) {
      return { status: false, message: "No events found." };
    }
    
    return {
      status: true,
      data: events,
      message: "Events retrieved successfully.",
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
    const eventId = new ObjectId(req.params.id);
    
    const event = await Event.findById(eventId).populate('organizer', 'name email phone');
    
    if (!event) {
      return { status: false, message: "Event not found." };
    }
    
    return {
      status: true,
      data: event,
      message: "Event retrieved successfully.",
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
    const eventId = new ObjectId(req.params.id);
    const updateData = req.body;
    
    // Check if current event exists
    const currentEvent = await Event.findById(eventId);
    
    if (!currentEvent) {
      return { status: false, message: "Event not found." };
    }
    
    // Check if user has permission to update this event
    // If user is not an admin, they should only update their own events
    if (req.headers.role !== 'admin' && 
        req.headers.user_id !== currentEvent.organizer.toString()) {
      return { 
        status: false, 
        message: "You don't have permission to update this event." 
      };
    }
    
    // If updating image, delete the old one
    if (updateData.image && currentEvent.image && updateData.image !== currentEvent.image) {
      const fileName = path.basename(currentEvent.image);
      await deleteFile(fileName);
    }
    
    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email phone');
    
    return {
      status: true,
      data: updatedEvent,
      message: "Event updated successfully.",
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
      return { status: false, message: "Invalid event ID." };
    }
    
    // Get event before deletion
    const event = await Event.findById(eventId);
    
    if (!event) {
      return { status: false, message: "Event not found or already deleted." };
    }
    
    // Check if user has permission to delete this event
    // If user is not an admin, they should only delete their own events
    if (req.headers.role !== 'admin' && 
        req.headers.user_id !== event.organizer.toString()) {
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
      data: deletedEvent
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete event.", 
      details: e.message 
    };
  }
};

// Update event status
export const UpdateEventStatusService = async (req) => {
  try {
    const eventId = new ObjectId(req.params.id);
    const { status } = req.body;
    
    // Validate status
    if (!status || !['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      return { 
        status: false, 
        message: "Invalid status. Must be one of: upcoming, ongoing, completed, cancelled." 
      };
    }
    
    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      return { status: false, message: "Event not found." };
    }
    
    // Check if user has permission to update this event's status
    // If user is not an admin, they should only update their own events
    if (req.headers.role !== 'admin' && 
        req.headers.user_id !== event.organizer.toString()) {
      return { 
        status: false, 
        message: "You don't have permission to update this event's status." 
      };
    }
    
    // Update event status
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: { status } },
      { new: true }
    ).populate('organizer', 'name email phone');
    
    return {
      status: true,
      data: updatedEvent,
      message: `Event status updated to ${status} successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update event status.", 
      details: e.message 
    };
  }
};

// Get events by organizer
export const GetEventsByOrganizerService = async (req) => {
  try {
    const organizerId = req.params.organizerId || req.headers.user_id;
    
    if (!organizerId || !ObjectId.isValid(organizerId)) {
      return { status: false, message: "Invalid organizer ID." };
    }
    
    // Get all events for this organizer
    const events = await Event.find({ organizer: organizerId })
      .sort({ date: 1 })
      .populate('organizer', 'name email phone');
    
    if (!events || events.length === 0) {
      return { status: false, message: "No events found for this organizer." };
    }
    
    return {
      status: true,
      data: events,
      message: "Organizer's events retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve organizer's events.", 
      details: e.message 
    };
  }
};

// Get upcoming events
export const GetUpcomingEventsService = async () => {
  try {
    const currentDate = new Date();
    
    // Get all upcoming events (date >= today)
    const upcomingEvents = await Event.find({
      date: { $gte: currentDate },
      status: 'upcoming'
    })
      .sort({ date: 1 })
      .populate('organizer', 'name email phone');
    
    if (!upcomingEvents || upcomingEvents.length === 0) {
      return { status: false, message: "No upcoming events found." };
    }
    
    return {
      status: true,
      data: upcomingEvents,
      message: "Upcoming events retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve upcoming events.", 
      details: e.message 
    };
  }
};
