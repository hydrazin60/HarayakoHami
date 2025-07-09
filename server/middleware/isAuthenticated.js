import jwt from "jsonwebtoken";
export const isAuthenticated = (req, res, next) => {
  try {
    // Check both lowercase and uppercase Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token =
      req.cookies?.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      console.log("Authentication headers:", req.headers);
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    const response = {
      success: false,
      message: "Authentication failed",
    };

    if (error.name === "TokenExpiredError") {
      response.message = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      response.message = "Invalid token format";
    }

    return res.status(401).json(response);
  }
};
