import { 
  CreateCarouselService, 
  GetAllCarouselService, 
  GetCarouselByIdService, 
  UpdateCarouselService, 
  DeleteCarouselService, 
  GetActiveCarouselService
} from '../service/CarouselService.js';

// Create Carousel
export const CreateCarousel = async (req, res) => {
  try {
    const result = await CreateCarouselService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error creating carousel item", 
      error: error.message 
    });
  }
};

// Get All Carousel Items
export const GetAllCarousel = async (req, res) => {
  try {
    const result = await GetAllCarouselService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error retrieving carousel items", 
      error: error.message 
    });
  }
};

// Get Carousel By ID
export const GetCarouselById = async (req, res) => {
  try {
    const result = await GetCarouselByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error retrieving carousel item", 
      error: error.message 
    });
  }
};

// Get Active Carousel
export const GetActiveCarousel = async (req, res) => {
  try {
    const result = await GetActiveCarouselService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error retrieving active carousel items", 
      error: error.message 
    });
  }
};

// Update Carousel
export const UpdateCarousel = async (req, res) => {
  try {
    const result = await UpdateCarouselService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error updating carousel item", 
      error: error.message 
    });
  }
};

// Delete Carousel
export const DeleteCarousel = async (req, res) => {
  try {
    const result = await DeleteCarouselService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error deleting carousel item", 
      error: error.message 
    });
  }
};
