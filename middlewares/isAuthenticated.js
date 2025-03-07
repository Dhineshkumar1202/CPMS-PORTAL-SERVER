import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

        console.log("Extracted Token:", token); // Debugging

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false,
            });
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Token expired or invalid. Please log in again.",
                    success: false,
                });
            }

            console.log("Decoded Token:", decoded); // Debugging

            if (!decoded?.userId) {
                return res.status(401).json({
                    message: "Invalid token.",
                    success: false,
                });
            }

            req.user = { userId: decoded.userId }; // ✅ Fix: Assign correctly
            next();
        });
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export default isAuthenticated;
