export const fileUpload = (req, res) => {
  try {
    // Check if files array exists in the request
    if (!req.files) {
      return res.status(400).json({ 
        status: false, 
        msg: "File upload middleware failed. Check request format."
      });
    }
    
    if (req.files.length > 0) {
      // Add full URLs to the files for easier client usage
      const fileData = req.files.map(file => ({
        ...file,
        url: `/uploads/${file.filename}`
      }));
      
      return res.status(200).json({
        status: true,
        file: fileData,
        msg: "Files uploaded successfully",
      });
    } else {
      return res.status(400).json({ 
        status: false, 
        msg: "No files were provided in the request" 
      });
    }
  } catch (e) {
    console.error("File upload error:", e);
    return res.status(500).json({ 
      status: false, 
      error: e.message || "Internal server error during file upload" 
    });
  }
};
