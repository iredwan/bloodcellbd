import { 
  CreateEventService, 
  GetAllEventsService, 
  GetEventByIdService, 
  UpdateEventService,
  DeleteEventService,
  UpdateEventStatusService,
  GetEventsByOrganizerService,
  GetUpcomingEventsService
} from '../service/EventService.js';

// Create Event
export const CreateEvent = async (req, res) => {
  try {
    const result = await CreateEventService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating event",
      error: error.message
    });
  }
};

// Get All Events
export const GetAllEvents = async (req, res) => {
  try {
    const result = await GetAllEventsService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving events",
      error: error.message
    });
  }
};

// Get Event By ID
export const GetEventById = async (req, res) => {
  try {
    const result = await GetEventByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving event",
      error: error.message
    });
  }
};

// Update Event
export const UpdateEvent = async (req, res) => {
  try {
    const result = await UpdateEventService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating event",
      error: error.message
    });
  }
};

// Delete Event
export const DeleteEvent = async (req, res) => {
  try {
    const result = await DeleteEventService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting event",
      error: error.message
    });
  }
};

// Update Event Status
export const UpdateEventStatus = async (req, res) => {
  try {
    const result = await UpdateEventStatusService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating event status",
      error: error.message
    });
  }
};

// Get Events By Organizer
export const GetEventsByOrganizer = async (req, res) => {
  try {
    const result = await GetEventsByOrganizerService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving events by organizer",
      error: error.message
    });
  }
};

// Get Upcoming Events
export const GetUpcomingEvents = async (req, res) => {
  try {
    const result = await GetUpcomingEventsService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upcoming events",
      error: error.message
    });
  }
}; 