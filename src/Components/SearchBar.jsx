import React from 'react'
import { FaSearch } from "react-icons/fa";
import "../App.css";


const SearchBar = () => {
  return (
    <div className="search-container">
      <button className="search-button">
        <FaSearch />
      </button>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search..."
      />
      
    </div>
  )
}

export default SearchBar;