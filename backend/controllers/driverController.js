import Ride from "../models/Ride.js";
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

const getRideRequests = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "requested",
      driver: null,
    })
      .populate("rider", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Ride requests fetched successfully",
      rides,
    });
  } catch (error) {
    console.error("Get ride requests error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    // Find a ride that is still available
    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "requested",
        driver: null,
      },
      {
        driver: req.user._id,
        status: "accepted",
      },
      {
        new: true,
      },
    ).populate("rider", "name phone");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or already accepted",
      });
    }

    res.status(200).json({
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    console.error("Accept ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const rejectRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "requested",
        driver: null,
      },
      {
        status: "cancelled",
      },
      {
        new: true,
      },
    );

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or already processed",
      });
    }

    res.status(200).json({
      message: "Ride rejected successfully",
      ride,
    });
  } catch (error) {
    console.error("Reject ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getCurrentRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      driver: req.user._id,
      status: "accepted",
    }).populate("rider", "name phone");

    if (!ride) {
      return res.status(404).json({
        message: "No current ride found",
      });
    }

    res.status(200).json({
      message: "Current ride fetched successfully",
      ride,
    });
  } catch (error) {
    console.error("Get current ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const startRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        driver: req.user._id,
        status: "accepted",
      },
      {
        status: "started",
      },
      {
        new: true,
      },
    ).populate("rider", "name phone");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or cannot be started",
      });
    }

    res.status(200).json({
      message: "Ride started successfully",
      ride,
    });
  } catch (error) {
    console.error("Start ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        driver: req.user._id,
        status: "started",
      },
      {
        status: "completed",
      },
      {
        new: true,
      },
    ).populate("rider", "name phone");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or cannot be completed",
      });
    }

    res.status(200).json({
      message: "Ride completed successfully",
      ride,
    });
  } catch (error) {
    console.error("Complete ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({
      driver: req.user._id,
      status: "completed",
    })
      .populate("rider", "name phone")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Ride history fetched successfully",
      rides,
    });
  } catch (error) {
    console.error("Get ride history error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getDriverEarnings = async (req, res) => {
  try {
    const result = await Ride.aggregate([
      {
        $match: {
          driver: req.user._id,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$fare" },
          totalRides: { $sum: 1 },
        },
      },
    ]);

    const earnings =
      result.length > 0
        ? result[0]
        : {
            totalEarnings: 0,
            totalRides: 0,
          };

    res.status(200).json({
      message: "Driver earnings fetched successfully",
      totalEarnings: earnings.totalEarnings,
      totalRides: earnings.totalRides,
    });
  } catch (error) {
    console.error("Get driver earnings error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  getDriverProfile,
  getRideRequests,
  acceptRide,
  rejectRide,
  getCurrentRide,
  startRide,
  completeRide,
  getRideHistory,
  getDriverEarnings,
};
