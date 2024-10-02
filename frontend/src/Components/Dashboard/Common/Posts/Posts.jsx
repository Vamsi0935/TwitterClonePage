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
    let url;

    switch (feedType) {
      case "forYou":
        url = "http://localhost:5000/api/posts/all";
        break;
      case "following":
        url = "http://localhost:5000/api/posts/following";
        break;
      default:
        url = "http://localhost:5000/api/posts/all";
        break;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (err) {
      setError("Failed to fetch posts."); 
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        await fetchPosts();
      } catch (err) {
        setError(err.message); 
      } finally {    
        setIsLoading(false); 
      }
    };

    loadPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  return (
    <>
      {error && <p className="error-message">{error}</p>}
      {!isLoading && posts.length === 0 && (
        <p className="no-posts-message text-light">
          No posts available. Switch the feed type! 👻
        </p>
      )}
      {!isLoading && posts.length > 0 && (
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
