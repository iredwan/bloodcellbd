import WebsiteConfig from "../models/WebsiteConfigModel.js";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

// Create or Update Website Configuration
export const UpsertWebsiteConfigService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (config) {
      // Handle logo update
      if (reqBody.logo && config.logo && reqBody.logo !== config.logo) {
        const fileName = path.basename(config.logo);
        await deleteFile(fileName);
      }
      
      // Handle favicon update
      if (reqBody.favicon && config.favicon && reqBody.favicon !== config.favicon) {
        const fileName = path.basename(config.favicon);
        await deleteFile(fileName);
      }
      
      // Update existing config
      config = await WebsiteConfig.findByIdAndUpdate(
        config._id,
        { $set: reqBody },
        { new: true, runValidators: true }
      );
      
      return {
        status: true,
        message: "Website configuration updated successfully.",
        data: config
      };
    } else {
      // Create new config
      config = new WebsiteConfig(reqBody);
      await config.save();
      
      return {
        status: true,
        message: "Website configuration created successfully.",
        data: config
      };
    }
  } catch (e) {
    return {
      status: false,
      message: "Failed to update website configuration.",
      details: e.message
    };
  }
};

// Get Website Configuration
export const GetWebsiteConfigService = async () => {
  try {
    const config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    return {
      status: true,
      message: "Website configuration retrieved successfully.",
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve website configuration.",
      details: e.message
    };
  }
};

// Update Contact Information
export const UpdateContactInfoService = async (req) => {
  try {
    const { email, phone, address } = req.body;
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    // Update contact info
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { 
        $set: { 
          'contactInfo.email': email || config.contactInfo.email,
          'contactInfo.phone': phone || config.contactInfo.phone,
          'contactInfo.address': address || config.contactInfo.address,
          lastUpdated: Date.now()
        } 
      },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      message: "Contact information updated successfully.",
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update contact information.",
      details: e.message
    };
  }
};

// Update Social Media Links
export const UpdateSocialMediaService = async (req) => {
  try {
    const { facebook, twitter, instagram, linkedin, youtube } = req.body;
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    // Update social media links
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { 
        $set: { 
          'socialMedia.facebook': facebook || config.socialMedia.facebook,
          'socialMedia.twitter': twitter || config.socialMedia.twitter,
          'socialMedia.instagram': instagram || config.socialMedia.instagram,
          'socialMedia.linkedin': linkedin || config.socialMedia.linkedin,
          'socialMedia.youtube': youtube || config.socialMedia.youtube,
          lastUpdated: Date.now()
        } 
      },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      message: "Social media links updated successfully.",
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update social media links.",
      details: e.message
    };
  }
};

// Update About Us Information
export const UpdateAboutUsService = async (req) => {
  try {
    const { aboutUs, mission, vision } = req.body;
    
    if (!aboutUs && !mission && !vision) {
      return {
        status: false,
        message: "At least one field (aboutUs, mission, vision) is required."
      };
    }
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    // Prepare update object
    const updateObj = { lastUpdated: Date.now() };
    if (aboutUs) updateObj.aboutUs = aboutUs;
    if (mission) updateObj.mission = mission;
    if (vision) updateObj.vision = vision;
    
    // Update about us information
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { $set: updateObj },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      message: "About us information updated successfully.",
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update about us information.",
      details: e.message
    };
  }
};

// Update Meta Tags
export const UpdateMetaTagsService = async (req) => {
  try {
    const { title, description, keywords } = req.body;
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    // Update meta tags
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { 
        $set: { 
          'metaTags.title': title || config.metaTags.title,
          'metaTags.description': description || config.metaTags.description,
          'metaTags.keywords': keywords || config.metaTags.keywords,
          lastUpdated: Date.now()
        } 
      },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      message: "Meta tags updated successfully.",
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update meta tags.",
      details: e.message
    };
  }
};

// Toggle Maintenance Mode
export const ToggleMaintenanceModeService = async (req) => {
  try {
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    // Toggle maintenance mode
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { 
        $set: { 
          maintenanceMode: !config.maintenanceMode,
          lastUpdated: Date.now()
        } 
      },
      { new: true }
    );
    
    return {
      status: true,
      message: `Maintenance mode ${config.maintenanceMode ? 'enabled' : 'disabled'} successfully.`,
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to toggle maintenance mode.",
      details: e.message
    };
  }
};

// Update Analytics Code
export const UpdateAnalyticsCodeService = async (req) => {
  try {
    const { analyticsCode } = req.body;
    
    if (!analyticsCode) {
      return {
        status: false,
        message: "Analytics code is required."
      };
    }
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      return {
        status: false,
        message: "Website configuration not found."
      };
    }
    
    // Update analytics code
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { 
        $set: { 
          analyticsCode,
          lastUpdated: Date.now()
        } 
      },
      { new: true }
    );
    
    return {
      status: true,
      message: "Analytics code updated successfully.",
      data: config
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update analytics code.",
      details: e.message
    };
  }
};
