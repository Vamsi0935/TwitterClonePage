import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./post.css";

const Post = ({ post, currentUser }) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videoRef = useRef(null); // Create a reference for the video element

  const postOwner = post?.user || {};
  const isMyPost = currentUser?._id === postOwner?._id;

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "Just now";

  useEffect(() => {
    if (post.likes && currentUser?._id) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
  }, [post.likes, currentUser?._id]);

  const handleDeletePost = async () => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (!confirmDelete.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire(
        "Error!",
        "You are not authorized to perform this action.",
        "error"
      );
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/delete/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the post.", "error");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsCommenting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Error!", "You must be logged in to comment.", "error");
      setIsCommenting(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/posts/comment/${post._id}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      Swal.fire("Success!", "Comment posted successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to post comment.", "error");
    } finally {
      setIsCommenting(false);
      setIsModalOpen(false);
    }
  };

  const handleLikePost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Error!", "You must be logged in to like a post.", "error");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedLikes = response.data;
      setIsLiked(!isLiked);
      setLikeCount(updatedLikes.length);
    } catch (error) {
      Swal.fire("Error!", "Failed to like/unlike the post.", "error");
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((error) => {
          console.error("Error trying to play the video:", error);
          Swal.fire("Error!", "Unable to play the video.", "error");
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="post-container">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.userName}`}
          className="rounded-full overflow-hidden"
        >
          <img src={"/avatar-placeholder.png"} alt="Profile" />
        </Link>
      </div>
      <div className="post-info">
        <div className="post-header">
          <Link to={`/profile/${postOwner.userName}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="post-meta">
            <Link to={`/profile/${postOwner.userName}`}>
              @{postOwner.userName}
            </Link>
            <span> · </span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="delete-post">
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={handleDeletePost}
              />
            </span>
          )}
        </div>
        <div className="post-content text-light">
          <span>{post.text}</span> {/* Fixed here */}
          {post.images && post.images.length > 0 && (
            <div className="post-images">
              {post.images.map((image, index) => (
                <img
                  key={index} // Add a unique key for each image
                  src={image}
                  className="post-image"
                  alt={`Post content ${index + 1}`}
                />
              ))}
            </div>
          )}
          {post.videos && post.videos.length > 0 && (
            <div className="post-video-container">
              <video
                ref={videoRef}
                controls
                className="post-video"
                width="100%"
                preload="metadata"
                onClick={togglePlayPause}
              >
                <source src={post.videos[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
        <div className="post-footer">
          <div className="actions">
            <div
              className="comment-action cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <FaRegComment className="icon" />
              <span className="comment-count">
                {post.comments?.length || 0}
              </span>
            </div>
            {isModalOpen && (
              <dialog open className="comment-modal">
                <div className="modal-content">
                  <h3>COMMENTS</h3>
                  <div className="comments-list">
                    {post.comments?.length === 0 ? (
                      <p>No comments yet 🤔</p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                          <img
                            src={
                              comment.user.profileImg ||
                              "/avatar-placeholder.png"
                            }
                            alt="Commenter"
                            className="rounded-full"
                          />
                          <div>
                            <strong>{comment.user.fullName}</strong>
                            <span>@{comment.user.username}</span>
                            <p>{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handlePostComment}>
                    <textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-comment"
                      disabled={isCommenting}
                    >
                      {isCommenting ? "Posting..." : "Post"}
                    </button>
                    <button
                      className="btn btn-close"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </form>
                </div>
              </dialog>
            )}
            <div
              className="like-action cursor-pointer"
              onClick={handleLikePost}
            >
              {isLiked ? (
                <FaHeart className="icon liked" />
              ) : (
                <FaRegHeart className="icon" />
              )}
              <span className="like-count">{likeCount}</span>
            </div>
            <div className="repost-action cursor-pointer">
              <BiRepost className="icon" />
              <span className="repost-count">{post.reposts?.length || 0}</span>
            </div>
            <div className="save-action cursor-pointer">
              <FaRegBookmark className="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
