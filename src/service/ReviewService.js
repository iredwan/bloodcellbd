import mongoose from 'mongoose';
import ReviewsModel from '../models/ReviewsModel.js';

// Create a new review
export const createReviewService = async (req) => {
  try {
    const reviewData = {
      ...req.body,
      user: req.headers.user_id || req.cookies.user_id,
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
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim() || '';
  const district = req.query.district?.trim() || '';
  const status = req.query.status?.trim() || '';

  const isAdmin = [
    "Divisional Coordinator", "Divisional Co-coordinator", "Head of IT & Media", "Head of Logistics", "Admin"
  ]

  const isDistrictCoordinator = [
    "District Coordinator", "District Co-coordinator", "District IT & Media Coordinator", "District Logistics Coordinator"
  ]

  // ✅ Use from req.user (set by protect middleware)
  const userRole = req.user?.role;
  const userId = req.user?.id;

  const andConditions = [];

  // 🔍 Search
  if (search) {
    andConditions.push({
      $or: [
        { review: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
        { 'user.phone': { $regex: search, $options: 'i' } }
      ]
    });
  }

  // 🌍 District
  if (district) {
    andConditions.push({ 'user.district': district });
  }

  // 📦 Status
  if (status) {
    andConditions.push({ status });
  }

  // 🔐 Role-based restriction
  if (!isAdmin.includes(userRole) && !isDistrictCoordinator.includes(userRole)) {
    andConditions.push({
      $or: [
        { status: 'approved' }, // Show approved reviews
      ]
    });
  }

  const matchStage = andConditions.length > 0 ? { $and: andConditions } : {};

  try {
    // 🎯 Filtered Reviews
    const reviews = await ReviewsModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          rating: 1,
          review: 1,
          status: 1,
          createdAt: 1,
          user: {
            _id: 1,
            name: 1,
            email: 1,
            phone: 1,
            district: 1,
            profileImage: 1,
            isVerified: 1
          }
        }
      }
    ]);

    let approvedReviewsFiltered = {}; // এটা হবে object

if (!isAdmin.includes(userRole)) {
  approvedReviewsFiltered.status = 'approved';
}

// 📊 Filtered Count
const totalReviews = await ReviewsModel.countDocuments(approvedReviewsFiltered);


    // 🔢 Status Counts (all, not filtered)
    const approvedReviews = await ReviewsModel.countDocuments({ status: 'approved' });
    const pendingReviews = await ReviewsModel.countDocuments({ status: 'pending' });
    const rejectedReviews = await ReviewsModel.countDocuments({ status: 'rejected' });

    // ⭐ Average Rating (only from approved)
    const avgRatingResult = await ReviewsModel.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    const averageRating = avgRatingResult[0]?.averageRating || 0;

    return {
      status: true,
      message: 'Reviews retrieved successfully',
      data: {
        reviews,
        page: parseInt(page),
        limit: parseInt(limit),
        totalReviews,
        approvedReviews,
        pendingReviews,
        rejectedReviews,
        averageRating
      }
    };
  } catch (e) {
    return {
      status: false,
      message: 'Failed to retrieve reviews',
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
