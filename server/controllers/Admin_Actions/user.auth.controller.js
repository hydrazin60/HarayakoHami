import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const UserRegister = async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      password = "",
      role = "member",
      e_sewaNumber = "",
    } = req.body;
    if (req.body === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Clean inputs
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedEsewaNumber = e_sewaNumber.trim();

    // Basic validation
    if (!cleanedName || !cleanedEmail || !password || !cleanedEsewaNumber) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, email, password, eSewa number) are required.",
      });
    }

    // Restrict role assignment
    const allowedRoles = ["admin", "user"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role type.",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: cleanedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: cleanedName,
      email: cleanedEmail,
      password: hashedPassword,
      role,
      e_sewaNumber: cleanedEsewaNumber,
      monthlyTarget: 1000,
    });

    // Sanitize output
    const userData = newUser.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: userData,
    });
  } catch (error) {
    console.error("Error in UserRegister:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error in UserRegister",
    });
  }
};

export const Login = async (req, res) => {
  if (req.body === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }
  try {
    // 1. Input Validation
    const { email = "", password = "" } = req.body;

    // Trim and validate inputs
    const cleanedEmail = email.toString().trim().toLowerCase();
    const cleanedPassword = password.toString().trim();

    if (!cleanedEmail || !cleanedPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 2. User Lookup with timing-safe comparison
    const user = await User.findOne({ email: cleanedEmail })
      .select("+password")
      .lean();
    if (!user) {
      // Use bcrypt to compare with dummy hash to prevent timing attacks
      await bcrypt.compare(
        cleanedPassword,
        "$2a$10$dummyhashdummyhashdummyhashdu"
      );
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 3. Password Verification
    const isPasswordValid = await bcrypt.compare(
      cleanedPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 4. Prepare User Data
    const userData = { ...user };
    delete userData.password;
    delete userData.__v; // Remove version key

    // 5. JWT Token Generation
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        // Add more claims if needed, but keep it minimal
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
        issuer: process.env.JWT_ISSUER || "harayakahami.com",
      }
    );

    // 6. Cookie Configuration
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax", // Changed to strict/lax for better security
      maxAge:
        parseInt(process.env.JWT_COOKIE_EXPIRES) || 30 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: process.env.COOKIE_DOMAIN || undefined,
    };

    // 7. Response
    return res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: `${user.name} logged in successfully`,
        data: userData,
        // Don't send token in body when using cookies (choose one method)
        // token: token, // Only include if using Authorization header
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};
