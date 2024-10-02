import User from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }
 
    const decoded = jwt.verify(token, "vamsikrishnad");

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token Expired" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
