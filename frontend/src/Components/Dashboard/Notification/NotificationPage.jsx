/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./NotificationPage.css";
import LoadingSpinner from "../Common/LoadingSpinner/LoadingSpinner";
import Sidebar from "../Sidebar/Sidebar";
import RightPanel from "../Common/RightPanel/RightPanel";

const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch notifications on component load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "https://twitter-clone-page-api.vercel.app/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        setError("Error fetching notifications");
        console.log("Error fetching notifications", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Function to delete all notifications
  const deleteNotifications = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete all your notifications!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("https://twitter-clone-page-api.vercel.app/api/notifications/delete", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNotifications([]);
        Swal.fire(
          "Deleted!",
          "All notifications have been deleted.",
          "success"
        );
      } catch (error) {
        console.log("Error deleting notifications", error);
        Swal.fire("Failed!", "Failed to delete notifications.", "error");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-around">
        <Sidebar />
        <div className="notification-container">
          <div className="header">
            <p className="header-title">Notifications</p>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="dropdown-button">
                <IoSettingsOutline />
              </div>
              <ul tabIndex={0} className="dropdown-content">
                <li>
                  <a onClick={deleteNotifications}>Delete all notifications</a>
                </li>
              </ul>
            </div>
          </div>
          {isLoading && (
            <div className="loading-container">
              <LoadingSpinner size="lg" />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          {!isLoading && notifications.length === 0 && (
            <div className="no-notifications">No notifications 🤔</div>
          )}
          {notifications.map((notification) => (
            <div className="notification-message" key={notification._id}>
              <div className="notification-item">
                {notification.type === "follow" && (
                  <FaUser className="w-7 h-7 text-primary" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-7 h-7 text-red-500" />
                )}
                <Link to={`/profile/${notification.from.userName}`}>
                  <div className="avatar">
                    <img
                      src={"/avatar-placeholder.png"}
                      alt={`${notification.from.userName}'s avatar`}
                    />
                  </div>
                  <div className="flex gap-1">
                    <span className="userName">
                      @{notification.from.userName}
                    </span>{" "}
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <RightPanel />
      </div>
    </>
  );
};

export default NotificationPage;
