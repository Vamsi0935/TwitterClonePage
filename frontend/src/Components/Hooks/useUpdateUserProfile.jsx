import { useState } from "react";
import axios from "axios";

const useUpdateUserProfile = () => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const updateProfile = async (formData) => {
    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsUpdatingProfile(false);
      return response.data;
    } catch (error) {
      setIsUpdatingProfile(false);
      console.error("Error updating profile:", error.response?.data || error);
      throw error;
    }
  };

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
