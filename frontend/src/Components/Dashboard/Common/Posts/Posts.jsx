import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./posts.css";
import axios from "axios";

const Posts = ({ feedType, currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    const apiUrl =
      feedType === "following"
        ? "http://localhost:5000/api/posts/following"
        : "http://localhost:5000/api/posts/all";

    try {
      const { data } = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType]);

  if (isLoading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <Post key={post._id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
};

export default Posts;
