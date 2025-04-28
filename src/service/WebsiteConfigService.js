import WebsiteConfig from "../models/WebsiteConfigModel.js";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";


export const UpsertWebsiteConfigService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Validate required fields for new configuration
    if (!req.body.logo && !await WebsiteConfig.findOne()) {
      return {
        status: false,
        message: "Logo is required for website configuration."
      };
    }
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (config) {
      // Handle logo update
      // if (reqBody.logo && config.logo && reqBody.logo !== config.logo) {
      //   const fileName = path.basename(config.logo);
      //   await deleteFile(fileName);
      // }
      
      // // Handle favicon update
      // if (reqBody.favicon && config.favicon && reqBody.favicon !== config.favicon) {
      //   const fileName = path.basename(config.favicon);
      //   await deleteFile(fileName);
      // }
      
      // // Handle meta tag image update
      // if (reqBody.metaTags?.image && config.metaTags?.image && 
      //     reqBody.metaTags.image !== config.metaTags.image) {
      //   const fileName = path.basename(config.metaTags.image);
      //   await deleteFile(fileName);
      // }
      
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

/**
 * Get Website Configuration
 * Retrieves the current website configuration
 */
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
