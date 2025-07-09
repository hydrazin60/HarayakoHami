import User from "../../models/User.js";

export const viewOwnProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const isUser = await User.findById(userId).select("-password");

    if (!isUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: isUser,
      message: "your profile is here",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const viewOtherProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const loginUserId = req.userId;
    if (!loginUserId) {
      return res.status(401).json({
        success: false,
        message: "you can't view others profile",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isUser = await User.findById(userId).select("-password");

    if (!isUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: isUser,
      message: "your profile is here",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
