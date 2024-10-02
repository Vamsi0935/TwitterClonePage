import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const useFollow = () => {
  const [isPending, setIsPending] = useState(false);

  const follow = async (userId) => {
    setIsPending(true);
    const token = localStorage.getItem("token"); // Get the token from local storage

    if (!userId) {
      console.error("Invalid userId passed to follow function");
      setIsPending(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "User ID is missing",
      });
    }

    try {
      console.log(`Attempting to follow/unfollow user with ID: ${userId}`);

      // Make the API request to follow/unfollow
      const res = await axios.post(
        `https://twitter-clone-page-api.vercel.app/api/users/follow/${userId}`, // Replace with your actual backend URL
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with the token
          },
        }
      );

      // Display a success message with the server response
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message,
      });

      // Return the response data for any further processing
      return res.data;
    } catch (error) {
      console.error("Error in follow function:", error);

      // Display an error alert
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.error ||
          error.message ||
          "Something went wrong!",
      });
    } finally {
      // Set isPending to false when the process is complete
      setIsPending(false);
    }
  };

  return { follow, isPending };
};

export default useFollow;
