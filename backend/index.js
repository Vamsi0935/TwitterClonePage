import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect("mongodb+srv://dvkrishna142000:RJBcF1eljej8WLqa@cluster0.uge5q.mongodb.net/TwitterClonePage?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("MongoDB Connected Successfully...");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

// Route imports
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import notificationRoutes from "./routes/notification.route.js";
import postRoutes from "./routes/post.route.js";

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(5000, () => {
  console.log(`Server is running on port 5000...`);
});
