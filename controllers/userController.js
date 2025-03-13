import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: 'something is missing',
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User exist with this email.",
                success: false,
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashPassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);

    }

}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'something is missing',
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrrect email or password",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrrect email or password",
                success: false,
            })
        };

        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            })
        };
        const tokenData = {
            userId: user._id
        }
        const token =  jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });


        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 60 * 1000, httpOnly: true, samesite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);

    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: No user found",
                success: false
            });
        }

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Handle file upload (if any)
        if (req.file) {
            user.profile.resume = req.file.path; // Save file path to user profile
        }

        // Update user data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
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





