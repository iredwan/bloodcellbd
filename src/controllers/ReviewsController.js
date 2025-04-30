import { 
  createReviewService, 
  getReviewsService, 
  getReviewByIdService, 
  updateReviewService, 
  deleteReviewService,
  updateReviewStatusService,
  getApprovedReviewsService,
  getReviewsByUserIdService
} from '../service/ReviewService.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const result = await createReviewService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating review",
      error: error.message
    });
  }
};

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const result = await getReviewsService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving reviews",
      error: error.message
    });
  }
};

// Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const result = await getReviewByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving review",
      error: error.message
    });
  }
};  

// Get approved reviews
export const getApprovedReviews = async (req, res) => {
  try {
    const result = await getApprovedReviewsService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving approved reviews",
      error: error.message
    });
  }
}

// Get reviews by user id
export const getReviewsByUserId = async (req, res) => {
  try {
    const result = await getReviewsByUserIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving reviews by user id",
      error: error.message
    });
  }
}

// Update a review
export const updateReview = async (req, res) => {
  try {
    const result = await updateReviewService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating review",
      error: error.message
    });
  }
};

// Update review status
export const updateReviewStatus = async (req, res) => {
  try {
    const result = await updateReviewStatusService(req);

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating review status",
      error: error.message
    });
  }
}

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const result = await deleteReviewService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting review",
      error: error.message
    });
  }
}; 