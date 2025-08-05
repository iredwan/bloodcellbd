import { 
  UpsertWebsiteConfigService, 
  GetWebsiteConfigService,
  deleteTopBannerService
} from "../service/WebsiteConfigService.js";


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

export const deleteTopBanner = async (req, res) => {
  try {
    const result = await deleteTopBannerService();
    res.status(200).json(result);
  } catch (e) { 
    res.status(500).json({
      status: false,
      message: "Failed to delete top banner.",
      details: e.message
    });
  }
};

 