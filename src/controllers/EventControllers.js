import { 
  CreateEventService, 
  GetAllEventsService, 
  GetEventByIdService, 
  UpdateEventService,
  DeleteEventService,
  GetUpcomingEventsService,
  GetCompletedEventsService
} from '../service/EventService.js';

// Create Event
export const CreateEvent = async (req, res) => {
  try {
    const result = await CreateEventService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting event",
      error: error.message
    });
  }
};

// Get Upcoming Events
export const GetUpcomingEvents = async (req, res) => {
  try {
    const result = await GetUpcomingEventsService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upcoming events",
      error: error.message
    });
  }
}; 

// Get Completed Events
export const GetCompletedEvents = async (req, res) => {
  try {
    const result = await GetCompletedEventsService(req);

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving completed events",
      error: error.message
    });
  }
};

