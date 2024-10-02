import multer from "multer";
import path from "path";
import fs from "fs";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/auth.model.js";

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter for image and video formats
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|mp4|avi/;
  const isValidExtension = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMimeType = fileTypes.test(file.mimetype);

  if (isValidExtension && isValidMimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, .mp4, and .avi formats allowed"));
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
}).fields([
  { name: "images", maxCount: 10 }, // Allow up to 10 images
  { name: "videos", maxCount: 5 }, // Allow up to 5 videos
]);

// Create a new post
export const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { text } = req.body;
    const userId = req.user._id.toString();

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure post has either text or media
    if (
      !text &&
      (!req.files.images || req.files.images.length === 0) &&
      (!req.files.videos || req.files.videos.length === 0)
    ) {
      return res.status(400).json({ error: "Post must have text or media" });
    }

    // Save image and video paths
    const images = req.files.images
      ? req.files.images.map((file) => file.path.replace(/\\/g, "/"))
      : [];
    const videos = req.files.videos
      ? req.files.videos.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    // Create the new post
    const newPost = new Post({
      user: userId,
      text,
      images,
      videos,
    });

    try {
      await newPost.save();
      res.status(201).json(newPost); // Respond with the created post
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    // Delete images and videos from the filesystem
    post.images.forEach((image) => fs.unlinkSync(image));
    post.videos.forEach((video) => fs.unlinkSync(video));

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Comment on Post
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like/Unlike Post
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      res
        .status(200)
        .json(post.likes.filter((id) => id.toString() !== userId.toString()));
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      // Create notification
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      res.status(200).json(post.likes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts.length ? posts : []);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Liked Posts
export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Following Posts
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const feedPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User's Posts
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
