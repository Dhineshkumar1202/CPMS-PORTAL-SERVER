import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false,
            });
        }

        if (!process.env.SECRET_KEY) {
            console.error("SECRET_KEY is missing in environment variables.");
            return res.status(500).json({
                message: "Internal server error. Please try again later.",
                success: false,
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (!decoded || !decoded.userId) {
                return res.status(401).json({
                    message: "Invalid token.",
                    success: false,
                });
            }

            req.id = decoded.userId;
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Token expired or invalid. Please log in again.",
                success: false,
            });
        }
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export default isAuthenticated;
