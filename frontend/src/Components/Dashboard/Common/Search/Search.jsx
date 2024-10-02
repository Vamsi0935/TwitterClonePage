import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import RightPanel from "../RightPanel/RightPanel";
import "./search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [filteredItems, setFilteredItems] = useState([]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="d-flex justify-content-around">
      <Sidebar />
      <form
        className="d-flex mt-5 search-container"
        role="search"
        onSubmit={handleSearch}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-success w-25" type="submit">
            Search
          </button>
        </div>
      </form>
      <RightPanel searchTerm={searchTerm} filteredItems={filteredItems} />
    </div>
  );
};

export default Search;
