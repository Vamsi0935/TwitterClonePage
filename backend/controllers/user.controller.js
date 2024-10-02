import bcrypt from "bcryptjs";
import Notification from "../models/notification.model.js";
import User from "../models/auth.model.js";
import mongoose from "mongoose";

// Get user profile by username
export const getUserProfile = async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await User.findOne({ userName }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Follow or unfollow a user
export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const currentUser = await User.findById(req.user._id).lean();
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    const userToModify = await User.findById(id);
    if (!userToModify) {
      return res
        .status(404)
        .json({ error: "User to follow/unfollow not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser:", error.message);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

// Get suggested users to follow
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId)
      .select("following")
      .lean();
    if (!usersFollowedByMe)
      return res.status(404).json({ error: "User not found" });

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  const { fullName, email, userName, currentPassword, newPassword, bio } =
    req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfileImg = async (req, res) => {
  try {
    const userId = req.params.id;
    const profileImgPath = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImg: profileImgPath },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile image", error });
  }
};

// Upload cover image
export const uploadCoverImg = async (req, res) => {
  try {
    const userId = req.params.id;
    const coverImgPath = req.file.path; // File path after upload

    const user = await User.findByIdAndUpdate(
      userId,
      { coverImg: coverImgPath },
      { new: true }
    );

    res.status(200).json({
      message: "Cover image uploaded successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading cover image", error });
  }
};
// Get Profile Image
export const getProfileImg = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profileImg) {
      return res.status(404).json({ message: "Profile image not found" });
    }

    res.status(200).json({ profileImg: user.profileImg });
  } catch (error) {
    console.log("Error fetching profile image:", error);
    res.status(500).json({ message: "Error fetching profile image", error });
  }
};

// Get Cover Image
export const getCoverImg = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.coverImg) {
      return res.status(404).json({ message: "Cover image not found" });
    }

    res.status(200).json({ coverImg: user.coverImg });
  } catch (error) {
    console.log("Error fetching cover image:", error);
    res.status(500).json({ message: "Error fetching cover image", error });
  }
};
