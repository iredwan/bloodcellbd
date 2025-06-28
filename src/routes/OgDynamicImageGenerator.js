import express from "express";
import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/request", async (req, res) => {
  try {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Query Parameters
    const bloodGroup = req.query.bloodGroup || "";
    const district = req.query.district || "";
    const upazila = req.query.upazila || "";
    const hospital = req.query.hospitalName || "";
    const requester = req.query.name || "Unknown";
    const profileImage = req.query.profileImage;

    // Load profile image with fallback
    let profileImg;
    try {
      if (profileImage) {
        const customImgPath = path.join(__dirname, "../../uploads", profileImage);
        const imgBuffer = fs.readFileSync(customImgPath);
        profileImg = await loadImage(imgBuffer);
      } else {
        throw new Error("No profile image provided");
      }
    } catch (err) {
      const fallbackImgPath = path.join(__dirname, "../../uploads/default-profile.png");
      const fallbackBuffer = fs.readFileSync(fallbackImgPath);
      profileImg = await loadImage(fallbackBuffer);
    }

    // Utility function to draw rounded rectangle
    function drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    }

    // Background
    ctx.fillStyle = "#8a0303";
    ctx.fillRect(0, 0, width, height);

    // Blood Circle
    ctx.beginPath();
    ctx.arc(600, 115, 77, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.font = "bold 67px sans-serif";
    ctx.fillStyle = "#8a0303";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bloodGroup, 600, 115);

    // Headings
    ctx.fillStyle = "white";
    ctx.font = "bold 67px sans-serif";
    ctx.fillText("Blood Needed", 600, 230);

    ctx.font = "56px sans-serif";
    ctx.fillText("in", 600, 290);

    // Hospital Info
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(hospital, 600, 335);
    ctx.font = "bold 35px sans-serif";
    ctx.fillText(`${upazila}, ${district}`, 600, 380);

    // Button
    const x = 428;
    const y = 428;
    const widthOfButton = 350;
    const heightOfButton = 57;
    const radius = heightOfButton / 2;

    ctx.fillStyle = "white";
    drawRoundedRect(ctx, x, y, widthOfButton, heightOfButton, radius);

    ctx.fillStyle = "#8a0303";
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Click for more details", 485 + 230 / 2, 455);

    // Vertical Line
    ctx.fillStyle = "white";
    ctx.fillRect(597, 492, 6, 82);

    // Requester Profile (Circular + object-fit: cover)
    ctx.save();
    ctx.beginPath();
    ctx.arc(140, 540, 59, 0, Math.PI * 2);
    ctx.clip();

    const targetSize = 118;
    const imgAspect = profileImg.width / profileImg.height;
    const targetAspect = 1;

    let sx, sy, sWidth, sHeight;
    if (imgAspect > targetAspect) {
      sHeight = profileImg.height;
      sWidth = sHeight * targetAspect;
      sx = (profileImg.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = profileImg.width;
      sHeight = sWidth / targetAspect;
      sx = 0;
      sy = (profileImg.height - sHeight) / 2;
    }

    ctx.drawImage(profileImg, sx, sy, sWidth, sHeight, 81, 481, 118, 118);
    ctx.restore();

    ctx.fillStyle = "white";
    ctx.font = "35px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(requester, 215, 540);

    // Website Logo
    ctx.fillStyle = "white";
    ctx.font = "bold 35px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("BloodCellBD", 1135, 540);

    // Convert to PNG and optimize
    const buffer = canvas.toBuffer("image/png");
    const optimized = await sharp(buffer).png({ quality: 90 }).toBuffer();

    res.set("Content-Type", "image/png");
    res.send(optimized);
  } catch (error) {
    console.error("OG generation failed:", error);
    res.status(500).send("Error generating OG image");
  }
});

export default router;
