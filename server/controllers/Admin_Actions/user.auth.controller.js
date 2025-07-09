import User from "../../models/User.js";
import bcrypt from "bcryptjs";

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
