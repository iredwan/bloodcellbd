import fs from "fs";
import path from "path";
import multer from "multer";

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "api-img" + Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage: fileStorageEngine });

export { upload };

export const deleteFile = async (fileName) => {
  try {
    const filePath = path.join("uploads", fileName); 
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
      return { status: true,};
    } else {
      throw new Error("File not found");
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
};