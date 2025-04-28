import WebsiteConfig from "../models/WebsiteConfigModel.js";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

/**
 * Create or Update Website Configuration
 * This is the main function for managing website configuration
 * It handles both creation of new config and updating existing config
 */
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
      if (reqBody.logo && config.logo && reqBody.logo !== config.logo) {
        const fileName = path.basename(config.logo);
        await deleteFile(fileName);
      }
      
      // Handle favicon update
      if (reqBody.favicon && config.favicon && reqBody.favicon !== config.favicon) {
        const fileName = path.basename(config.favicon);
        await deleteFile(fileName);
      }
      
      // Handle meta tag image update
      if (reqBody.metaTags?.image && config.metaTags?.image && 
          reqBody.metaTags.image !== config.metaTags.image) {
        const fileName = path.basename(config.metaTags.image);
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

/**
 * Update Contact Information
 * Updates only the contact info section of website configuration
 */
export const UpdateContactInfoService = async (req) => {
  try {
    const { email, phone, address } = req.body;
    
    // Validate input: at least one contact field should be provided
    if (!email && !phone && !address) {
      return {
        status: false,
        message: "At least one contact field (email, phone, or address) is required."
      };
    }
    
    // Validate email format if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return {
        status: false,
        message: "Invalid email format."
      };
    }
    
    // Check if config exists
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      // Create a basic config if it doesn't exist
      config = new WebsiteConfig({
        logo: req.body.logo || "",
        contactInfo: {
          email: email || "",
          phone: phone || "",
          address: address || ""
        }
      });
      await config.save();
      
      return {
        status: true,
        message: "New website configuration created with contact information.",
        data: config
      };
    }
    
    // Update contact info
    config = await WebsiteConfig.findByIdAndUpdate(
      config._id,
      { 
        $set: { 
          'contactInfo.email': email !== undefined ? email : config.contactInfo?.email,
          'contactInfo.phone': phone !== undefined ? phone : config.contactInfo?.phone,
          'contactInfo.address': address !== undefined ? address : config.contactInfo?.address
        } 
      },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      message: "Contact information updated successfully.",
      data: config.contactInfo
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update contact information.",
      details: e.message
    };
  }
};
