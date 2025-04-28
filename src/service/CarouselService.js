import CarouselModel from "../models/carouselModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create a new carousel item
export const CreateCarouselService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Create new carousel item
    const newCarousel = new CarouselModel(reqBody);
    await newCarousel.save();
    
    return { 
      status: true, 
      message: "Carousel item created successfully.",
      data: newCarousel
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create carousel item.", 
      details: e.message 
    };
  }
};

// Get all carousel items
export const GetAllCarouselService = async (req) => {
  try {
    // Optional query for active only
    const filter = {};
    
    if (req.query.active === 'true') {
      filter.isActive = true;
    }
    
    // Get all carousel items, sort by order
    const carouselItems = await CarouselModel.find(filter).sort({ order: 1 });
    
    if (!carouselItems || carouselItems.length === 0) {
      return { status: false, message: "No carousel items found." };
    }
    
    return {
      status: true,
      data: carouselItems,
      message: "Carousel items retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve carousel items.", 
      details: e.message 
    };
  }
};

// Get carousel item by ID
export const GetCarouselByIdService = async (req) => {
  try {
    const carouselId = new ObjectId(req.params.id);
    
    const carouselItem = await CarouselModel.findById(carouselId);
    
    if (!carouselItem) {
      return { status: false, message: "Carousel item not found." };
    }
    
    return {
      status: true,
      data: carouselItem,
      message: "Carousel item retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve carousel item.", 
      details: e.message 
    };
  }
};

//Get Active Carousel
export const GetActiveCarouselService = async (req) => {
  try {
    const carouselItems = await CarouselModel.find({ isActive: true }).sort({ order: 1 });
    
    if (!carouselItems || carouselItems.length === 0) {
      return { status: false, message: "No active carousel items found." };
    }
    return {
      status: true,
      data: carouselItems,
      message: "Active carousel items retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false,  
      message: "Failed to retrieve active carousel items.", 
      details: e.message 
    };
  }
};


// Update carousel item
export const UpdateCarouselService = async (req) => {
  try {
    const carouselId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if current carousel exists
    const currentCarousel = await CarouselModel.findById(carouselId);
    
    if (!currentCarousel) {
      return { status: false, message: "Carousel item not found." };
    }
    
    // If updating image, delete the old one
    if (reqBody.imageUrl && currentCarousel.imageUrl && reqBody.imageUrl !== currentCarousel.imageUrl) {
      const fileName = path.basename(currentCarousel.imageUrl);
      await deleteFile(fileName);
    }
    
    // Update carousel
    const updatedCarousel = await CarouselModel.findByIdAndUpdate(
      carouselId,
      { $set: reqBody },
      { new: true }
    );
    
    return {
      status: true,
      data: updatedCarousel,
      message: "Carousel item updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update carousel item.", 
      details: e.message 
    };
  }
};

// Delete carousel item
export const DeleteCarouselService = async (req) => {
  try {
    const carouselId = req.params.id;
    
    if (!ObjectId.isValid(carouselId)) {
      return { status: false, message: "Invalid carousel item ID." };
    }
    
    // Get carousel before deletion to access image URL
    const carousel = await CarouselModel.findById(carouselId);
    
    if (!carousel) {
      return { status: false, message: "Carousel item not found or already deleted." };
    }
    
    // Delete the image file if it exists
    if (carousel.imageUrl) {
      const fileName = path.basename(carousel.imageUrl);
      await deleteFile(fileName);
    }
    
    // Delete the carousel item
    const deletedCarousel = await CarouselModel.findByIdAndDelete(carouselId);
    
    return {
      status: true,
      message: "Carousel item deleted successfully.",
      data: deletedCarousel
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete carousel item.", 
      details: e.message 
    };
  }
};