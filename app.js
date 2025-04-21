import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import userRoutes from './src/routes/UserRoutes.js';
import requestRoutes from './src/routes/RequestRoutes.js';
import otpRoutes from './src/routes/OTPRoutes.js';
import carouselRoutes from './src/routes/CarouselRoutes.js';
import eventRoutes from './src/routes/EventRoutes.js';
import sponsorRoutes from './src/routes/SponsorRoutes.js';
import goodwillAmbassadorRoutes from './src/routes/GoodwillAmbassadorRoutes.js';
import boardTeamRoutes from './src/routes/BoardTeamRoutes.js';
import divisionalTeamRoutes from './src/routes/DivisionalTeamRoutes.js';
import districtTeamRoutes from './src/routes/DistrictTeamRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use('/api', limiter); // Apply rate limiting to API routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true // Allow cookies with CORS
}));
app.use(express.json({ limit: '10kb' })); // Body parser, limited to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); // Parse cookies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/ambassadors', goodwillAmbassadorRoutes);
app.use('/api/board-team', boardTeamRoutes);
app.use('/api/divisional-team', divisionalTeamRoutes);
app.use('/api/district-team', districtTeamRoutes);
// Root route
app.get('/', (req, res) => {
  res.send('Blood Cell BD API is running');
});

app.use("/upload-file", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
