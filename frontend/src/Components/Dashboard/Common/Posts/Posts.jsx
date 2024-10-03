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

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [feedType]);

  if (isLoading) {
    return <p className="loading-message">Loading posts...</p>;
  }

  return (
    <>
      {error && <p className="error-message">{error}</p>}
      {!error && posts.length === 0 && (
        <p className="no-posts-message text-light">
          No posts available. Switch the feed type! 👻
        </p>
      )}
      {!error && posts.length > 0 && (
        <div className="posts-container">
          {posts.map((post) => (
            <Post key={post._id} post={post} currentUser={currentUser} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
