import User from "../models/User.js";

// GET /api/rider/profile  (protected, rider only)
const getProfile = async (req, res) => {
  // req.user is already set by authMiddleware.protect
  return res.status(200).json({ user: req.user });
};

// PUT /api/rider/profile  (protected, rider only)
// Body: any subset of { name, phone }
// Deliberately does NOT allow updating email, password, or role here —
// those go through dedicated auth flows (or a future "change password" endpoint).
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export { getProfile, updateProfile };
