import {
  UpsertWebsiteConfigService,
  GetWebsiteConfigService,
  UpdateContactInfoService,
  UpdateSocialMediaService,
  UpdateAboutUsService,
  UpdateMetaTagsService,
  ToggleMaintenanceModeService,
  UpdateAnalyticsCodeService
} from '../service/WebsiteConfigService.js';

// Create or Update Website Configuration
export const UpsertWebsiteConfig = async (req, res) => {
  try {
    const result = await UpsertWebsiteConfigService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating website configuration",
      error: error.message
    });
  }
};

// Get Website Configuration
export const GetWebsiteConfig = async (req, res) => {
  try {
    const result = await GetWebsiteConfigService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving website configuration",
      error: error.message
    });
  }
};

// Update Contact Information
export const UpdateContactInfo = async (req, res) => {
  try {
    const result = await UpdateContactInfoService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating contact information",
      error: error.message
    });
  }
};

// Update Social Media Links
export const UpdateSocialMedia = async (req, res) => {
  try {
    const result = await UpdateSocialMediaService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating social media links",
      error: error.message
    });
  }
};

// Update About Us Information
export const UpdateAboutUs = async (req, res) => {
  try {
    const result = await UpdateAboutUsService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating about us information",
      error: error.message
    });
  }
};

// Update Meta Tags
export const UpdateMetaTags = async (req, res) => {
  try {
    const result = await UpdateMetaTagsService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating meta tags",
      error: error.message
    });
  }
};

// Toggle Maintenance Mode
export const ToggleMaintenanceMode = async (req, res) => {
  try {
    const result = await ToggleMaintenanceModeService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling maintenance mode",
      error: error.message
    });
  }
};

// Update Analytics Code
export const UpdateAnalyticsCode = async (req, res) => {
  try {
    const result = await UpdateAnalyticsCodeService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating analytics code",
      error: error.message
    });
  }
}; 