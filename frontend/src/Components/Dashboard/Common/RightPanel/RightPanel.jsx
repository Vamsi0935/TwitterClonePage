import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./rightpanel.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useFollow from "../../../Hooks/useFollow";

const RightPanel = ({ searchTerm, filteredItems }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingFollowIds, setPendingFollowIds] = useState([]);
  const { follow } = useFollow();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://twitter-clone-page-api.vercel.app/api/users/suggested",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggestedUsers(res.data);
        console.log("Fetched suggested users:", res.data);
      } catch (err) {
        console.error("Error fetching suggested users:", err);
        setError(err.response?.data?.error || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleFollow = async (userId) => {
    console.log(`Handling follow for user with ID: ${userId}`);
    setPendingFollowIds((prev) => [...prev, userId]);

    const result = await follow(userId);

    if (result) {
      setSuggestedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );
    }

    setPendingFollowIds((prev) => prev.filter((id) => id !== userId));
  };

  const displayedUsers = searchTerm
    ? suggestedUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suggestedUsers;

  return (
    <div className="right-panel">
      <div className="right-panel-header">
        <p className="header-title">Who to follow</p>
        {isLoading && <LoadingSpinner />}
        {error && <p className="error-message">{error}</p>}
        <div className="user-list">
          {!isLoading &&
            displayedUsers.map((user) =>
              user?.userName ? (
                <Link 
                  to={`/profile/${user.userName}`}
                  className="user-item"
                  key={user._id}
                >
                  <div className="user-info">
                    <div className="avatar">
                      <div className="avatar-img">
                        <img
                          src={user.profileImg || "/avatar-placeholder.png"}
                          alt={user.fullName || "User Avatar"}
                        />
                      </div>
                    </div>
                    <div className="user-details">
                      <span className="user-fullname text-light">
                        {user.fullName || "Unknown User"}
                      </span>
                      <span className="user-userName text-light">
                        @{user.userName}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      className="follow-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFollow(user._id);
                      }}
                      disabled={pendingFollowIds.includes(user._id)}
                    >
                      {pendingFollowIds.includes(user._id)
                        ? "Following..."
                        : user.isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  </div>
                </Link>
              ) : (
                <div key={user._id} className="user-item error-item">
                  <p>Invalid User Data</p>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
