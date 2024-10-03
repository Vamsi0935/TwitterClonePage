import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./profile.css";
import axios from "axios";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import Posts from "../../Dashboard/Common/Posts/Posts";
import Sidebar from "../../Dashboard/Sidebar/Sidebar";
import RightPanel from "../../Dashboard/Common/RightPanel/RightPanel";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const isMyProfile = true;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Could not fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) return; // Ensure user is available
      try {
        const token = localStorage.getItem("token");
        const userId = user._id; // Ensure user ID is available
        const profileImgResponse = await axios.get(
          `http://localhost:5000/api/users/user/${userId}/profile-image`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const coverImgResponse = await axios.get(
          `http://localhost:5000/api/users/user/${userId}/cover-image`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfileImg(profileImgResponse.data.profileImg);
        setCoverImg(coverImgResponse.data.coverImg);
      } catch (error) {
        console.error("Error fetching images", error);
      }
    };

    fetchImages();
  }, [user]);

  const handleImgChange = async (e, state) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (state === "coverImg") setCoverImg(reader.result);
      if (state === "profileImg") setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    const userId = user._id;

    formData.append(state === "profileImg" ? "profileImg" : "coverImg", file);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/upload/${
          state === "profileImg" ? "profile" : "cover"
        }/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${
          state === "profileImg" ? "Profile" : "Cover"
        } image uploaded successfully!`,
      });
    } catch (error) {
      console.error(
        `Error uploading ${state === "profileImg" ? "profile" : "cover"} image`,
        error
      );
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to upload ${
          state === "profileImg" ? "profile" : "cover"
        } image.`,
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-around">
        <Sidebar />
        <div className="profile-container">
          {isLoading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !user && (
            <p className="user-not-found">User not found</p>
          )}
          {!isLoading && user && (
            <>
              <div className="profile-header">
                <Link to="/dashboard" className="back-link">
                  <FaArrowLeft className="icon" />
                </Link>
                <div className="profile-info">
                  <p className="profile-name text-light">{user.fullName}</p>
                  <span className="post-count text-light">
                    {user.posts?.length} posts
                  </span>
                </div>
              </div>
              <div className="cover-img-container">
                <img
                  src={"/cover.png"} 
                  className="cover-img"
                  alt="cover"
                />
                {isMyProfile && (
                  <div
                    className="edit-cover-icon"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="icon" />
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  accept='image/*'
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept='image/*'
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                <div className="avatar-container">
                  <div className="profile-avatar">
                    <img
                      src={"/avatar-placeholder.png"}
                      alt="Profile"
                    />
                    {isMyProfile && (
                      <div className="edit-profile-icon">
                        <MdEdit
                          className="icon"
                          onClick={() => setIsEditModalOpen(true)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="button-container">
                {isMyProfile && (
                  <button
                    className="edit-button btn btn-primary w-25 mt-5"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </button>
                )}
                {!isMyProfile && (
                  <button
                    className="follow-button"
                    onClick={() => Swal.fire("Followed successfully")}
                  >
                    Follow
                  </button>
                )}
              </div>

              <div className="user-details">
                <div className="details-header">
                  <span className="user-fullName text-light">
                    {user.fullName}
                  </span>
                  <span className="username text-light">@{user.userName}</span>
                  <span className="bio">{user.bio}</span>
                </div>
                <div className="follow-info">
                  <div className="following">
                    <span className="count">{user.following.length}</span>
                    <span className="label">Following</span>
                  </div>
                  <div className="followers">
                    <span className="count">{user.followers.length}</span>
                    <span className="label">Followers</span>
                  </div>
                </div>
              </div>

              <div className="feed-switch">
                <button
                  className={`feed-button ${
                    feedType === "posts" ? "active" : ""
                  }`}
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                </button>
                <button
                  className={`feed-button ${
                    feedType === "likes" ? "active" : ""
                  }`}
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                </button>
              </div>
              <div className="user-feed">
                {feedType === "posts" && <Posts userId={user._id} />}
                {feedType === "likes"}
              </div>
              {isEditModalOpen && (
                <EditProfileModal
                  user={user}
                  onClose={() => setIsEditModalOpen(false)}
                  setUser={setUser}
                />
              )}
            </>
          )}
        </div>
        <RightPanel />
      </div>
    </>
  );
};

export default ProfilePage;
