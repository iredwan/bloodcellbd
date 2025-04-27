import { GetAllDivisionsService } from '../service/DivisionService.js';

// Get All Divisions
export const GetAllDivisions = async (req, res) => {
  try {
    const result = await GetAllDivisionsService();
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisions",
      error: error.message
    });
  }
}; 