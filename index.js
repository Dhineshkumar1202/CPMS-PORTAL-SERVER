import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js"
import companyRoute from "./routes/companyRoute.js"
import jobRoute from "./routes/jobRoute.js"
import applicationRoute from "./routes/applicationRoute.js";
dotenv.config({});
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',  
    credentials: true                 
};
app.use(cors());

// Test Route
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I am coming from backend",
        success: true
    });
});

// APIs
app.use('/api/user',userRoute);
app.use('/api/company',companyRoute);
app.use('/api/job',jobRoute);
app.use('/api/application',applicationRoute);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

