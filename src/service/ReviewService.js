import ReviewsModel from '../models/ReviewsModel.js';

// Create a new review
export const createReviewService = async (req) => {
  try {
    const reviewData = {
      ...req.body,
      user: req.headers.user_id || req.cookies.user_id
    };
    
    const review = new ReviewsModel(reviewData);
    await review.save();
    
    return {
      status: true,
      message: "Review created successfully",
      data: review
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create review", 
      details: e.message 
    };
  }
};

// Get all reviews
export const getReviewsService = async (req) => {
  try {
    const reviews = await ReviewsModel.find({})
      .populate('user', 'name phone profileImage isVerified')
      .sort({ createdAt: -1 });
    
    if (!reviews || reviews.length === 0) {
      return { status: false, message: "No reviews found" };
    }
    
    return {
      status: true,
      message: "Reviews retrieved successfully",
      data: reviews
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve reviews", 
      details: e.message 
    };
  }
};

// Get a single review by ID
export const getReviewByIdService = async (req) => {
  try {
    const reviewId = req.params.id;
    
    const review = await ReviewsModel.findById(reviewId)
      .populate('user', 'name phone profileImage isVerified');
    
    if (!review) {
      return { status: false, message: "Review not found" };
    }
    
    return {
      status: true,
      message: "Review retrieved successfully",
      data: review
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve review", 
      details: e.message 
    };
  }
};

// Get approved reviews
export const getApprovedReviewsService = async (req) => {
  try {
    const reviews = await ReviewsModel.find({ status: 'approved' })
      .populate('user', 'name phone profileImage isVerified');

    return {
      status: true,
      message: "Approved reviews retrieved successfully",
      data: reviews
    };
  }
  catch (e) {
    return {
      status: false,
      message: "Failed to retrieve approved reviews",
      details: e.message
    };
  }
} 

//Get reviews by user id
export const getReviewsByUserIdService = async (req) => {
  try {

    const user_id = req.headers.user_id || req.cookies.user_id;
    const reviews = await ReviewsModel.find({ user: user_id })
      .populate('user', 'name phone profileImage isVerified');

    return {
      status: true,
      message: "Reviews retrieved successfully",
      data: reviews
    };
  }
  catch (e) {
    return {
      status: false,
      message: "Failed to retrieve reviews by user id",
      details: e.message
    };
  }
}

// Update a review
export const updateReviewService = async (req) => {
  try {
    const reviewId = req.params.id;
    const reviewData = req.body;
    
    // Find the review first to check if user is authorized
    const existingReview = await ReviewsModel.findById(reviewId);
    
    if (!existingReview) {
      return { status: false, message: "Review not found" };
    }
    
    // Update the review
    const updatedReview = await ReviewsModel.findByIdAndUpdate(
      reviewId,
      reviewData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    return {
      status: true,
      message: "Review updated successfully",
      data: updatedReview
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update review", 
      details: e.message 
    };
  }
};

// Update review status
export const updateReviewStatusService = async (req) => {
  try {
    const reviewId = req.params.id;
    const { status } = req.body;        

    const review = await ReviewsModel.findById(reviewId);

    if (!review) {
      return { status: false, message: "Review not found" };
    }   

    const approvedBy = req.headers.user_id || req.cookies.user_id;

    review.status = status;
    review.approvedBy = approvedBy;
    await review.save();

    return { status: true, message: "Review status updated successfully" };
  } catch (e) {
    return { status: false, message: "Failed to update review status", details: e.message };
  }
};

// Delete a review
export const deleteReviewService = async (req) => {
  try {
    const reviewId = req.params.id;
    
    // Find the review first to check if user is authorized
    const existingReview = await ReviewsModel.findById(reviewId);
    
    if (!existingReview) {
      return { status: false, message: "Review not found or already deleted" };
    }
    
    
    // Delete the review
    await ReviewsModel.findByIdAndDelete(reviewId);
    
    return {
      status: true,
      message: "Review deleted successfully"
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete review", 
      details: e.message 
    };
  }
};
