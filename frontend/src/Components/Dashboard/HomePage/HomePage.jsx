import { useState } from "react";
import "./homepage.css";
import CreatePost from "../CreatePost/CreatePost";
import Posts from "../Common/Posts/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="homepage">
      <div className="header">
        <div
          className={`feed-option ${feedType === "forYou" ? "active" : ""}`}
          onClick={() => setFeedType("forYou")}
        >
          For you
          {feedType === "forYou" && <div className="active-indicator"></div>}
        </div>
        <div
          className={`feed-option ${feedType === "following" ? "active" : ""}`}
          onClick={() => setFeedType("following")}
        >
          Following
          {feedType === "following" && <div className="active-indicator"></div>}
        </div>
      </div>
      <CreatePost />
      <Posts feedType={feedType} />{" "}
    </div>
  );
};

export default HomePage;
