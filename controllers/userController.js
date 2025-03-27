import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1d' });
};

// Register User
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email", success: false });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Profile picture is required", success: false });
        }

        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashPassword,
            role,
            profile: { profilePhoto: cloudResponse.secure_url }
        });

        const token = generateToken(user._id);
        return res.status(201).json({
            message: "Account created successfully",
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Incorrect email or password", success: false });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }

        const token = generateToken(user._id);
        return res.status(200).json({
            message: `Welcome back ${user.fullname}`,
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided", success: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token", success: false });
    }
};
// Logout User (Client should remove the token)
export const logout = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Logout successful. Please remove the token from storage.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const skillsArray = skills ? skills.split(",") : [];
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skillsArray.length ? skillsArray : user.profile.skills;

        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: "auto" });
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully.", success: true, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
