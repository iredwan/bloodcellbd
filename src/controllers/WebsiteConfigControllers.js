import { 
  UpsertWebsiteConfigService, 
  GetWebsiteConfigService, 
  UpdateContactInfoService
} from "../service/WebsiteConfigService.js";

/**
 * Create or Update Website Configuration
 * Handles both creation of new config and updating existing config
 */
export const UpsertWebsiteConfig = async (req, res) => {
  try {
    const result = await UpsertWebsiteConfigService(req);
    
    if (!result.status) {
      return res.status(400).json(result);
    }
    
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Failed to update website configuration.",
      details: e.message
    });
  }
};

/**
 * Get Website Configuration
 * Retrieves the current website configuration
 */
export const GetWebsiteConfig = async (req, res) => {
  try {
    const result = await GetWebsiteConfigService();
    
    if (!result.status) {
      return res.status(404).json(result);
    }
    
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve website configuration.",
      details: e.message
    });
  }
};

/**
 * Update Contact Information
 * Updates only the contact info section of website configuration
 */
export const UpdateContactInfo = async (req, res) => {
  try {
    const result = await UpdateContactInfoService(req);
    
    if (!result.status) {
      return res.status(400).json(result);
    }
    
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Failed to update contact information.",
      details: e.message
    });
  }
}; 