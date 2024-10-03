import { useState } from "react";
import "./EditProfileModal.css";
import useUpdateUserProfile from "../../Hooks/useUpdateUserProfile";

const EditProfileModal = ({ onClose, user, setUser }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.userName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    link: user?.link || "",
    newPassword: "",
    currentPassword: "",
    profileImage: null, 
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file }); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(); 

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="modal-title">Update Profile</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={formData.fullName}
              name="fullName"
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              value={formData.username}
              name="username"
              onChange={handleInputChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
            />
            <textarea
              placeholder="Bio"
              className="input-field"
              value={formData.bio}
              name="bio"
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Website Link"
              className="input-field"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <input
              type="file"
              className="input-field"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="password-field">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                className="input-field"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={toggleCurrentPasswordVisibility}
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="password-field">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="input-field"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="submit"
              className="modal-button"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="modal-button modal-close"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditProfileModal;
