import User from "../models/User.js";

const getDriverProfile = async (req, res) => {
  try {
    const driver = await User.findById(req.user._id).select("-password");

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    if (driver.role !== "driver") {
      return res.status(403).json({
        message: "Access denied: driver only",
      });
    }

    res.status(200).json({
      message: "Driver profile fetched successfully",
      driver,
    });
  } catch (error) {
    console.error("Get driver profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export { getDriverProfile };
