import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaVideo } from "react-icons/fa";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import Swal from "sweetalert2";
import "./createpost.css";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); 
  const [videos, setVideos] = useState([]); 
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const [isPending, setIsPending] = useState(false);

  const token = localStorage.getItem("token");

  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const validVideoTypes = ["video/mp4", "video/webm"];
  const maxFileSize = 5 * 1024 * 1024; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("text", text);

      images.forEach((image) => {
        formData.append("images", image);
      });

      videos.forEach((video) => {
        formData.append("videos", video);
      });

      await axios.post("https://twitter-clone-page-api.vercel.app/api/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Post created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      setText("");
      setImages([]);
      setVideos([]);
      imgRef.current.value = null;
      videoRef.current.value = null;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create post. Please try again.",
      });
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (type === "image" && validImageTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          setImages((prev) => [...prev, file]);
        } else {
          Swal.fire({
            icon: "error",
            title: "File too large",
            text: "File size exceeds the 5MB limit.",
          });
        }
      } else if (type === "video" && validVideoTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          setVideos((prev) => [...prev, file]);
        } else {
          Swal.fire({
            icon: "error",
            title: "File too large",
            text: "File size exceeds the 5MB limit.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid file type",
          text: "Only JPG, PNG, GIF images or MP4, WEBM videos are allowed.",
        });
      }
    });
  };

  return (
    <div className="create-post">
      <div className="avatar">
        <img src="/avatar-placeholder.png" alt="Profile" />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {images.length > 0 && (
          <div className="image-preview">
            {images.map((img, index) => (
              <div key={index}>
                <IoCloseSharp
                  className="close-button"
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                />
                <img src={URL.createObjectURL(img)} alt="Preview" />
              </div>
            ))}
          </div>
        )}
        {videos.length > 0 && (
          <div className="video-preview">
            {videos.map((video, index) => (
              <div key={index}>
                <IoCloseSharp
                  className="close-button"
                  onClick={() =>
                    setVideos(videos.filter((_, i) => i !== index))
                  }
                />
                <video src={URL.createObjectURL(video)} controls />
              </div>
            ))}
          </div>
        )}
        <div className="footer">
          <div className="footer-icons">
            <CiImageOn onClick={() => imgRef.current.click()} />
            <FaVideo onClick={() => videoRef.current.click()} />
            <BsEmojiSmileFill />
          </div>
          <input
            type="file"
            multiple
            hidden
            ref={imgRef}
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
          />
          <input
            type="file"
            multiple
            hidden
            ref={videoRef}
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
          />
          <button className="follow-button" disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
