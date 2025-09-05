 import React, { useState } from 'react'
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { searchItems } from '../services/api';
import "../App.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await searchItems(searchQuery);
      setSearchResults(response.data || []);
      setShowResults(true);
    } catch (err) {
      setError(err.message || 'Error searching items');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = (itemId) => {
    // Navigate to lost item form with claim context
    navigate('/report-lost', { 
      state: { 
        claimingItem: itemId,
        isClaimMode: true 
      } 
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="search-container-wrapper">
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <button type="submit" className="search-button" disabled={isLoading}>
            <FaSearch />
          </button>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for lost items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-button"
              onClick={clearSearch}
            >
              <FaTimes />
            </button>
          )}
        </form>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="search-results-container">
          <div className="search-results-header">
            <h3>Search Results ({searchResults.length} found)</h3>
            <button onClick={clearSearch} className="close-results-btn">
              <FaTimes />
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {searchResults.length === 0 && !error && (
            <div className="no-results">
              No items found matching "{searchQuery}". Try different keywords.
            </div>
          )}

          <div className="search-results-list">
            {searchResults.map((item) => (
              <div key={item._id} className="search-result-item">
                <div className="result-image">
                  {item.image ? (
                    <img 
                      src={`http://localhost:5000${item.image}`} 
                      alt={item.itemName}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                </div>
                
                <div className="result-details">
                  <h4>{item.itemName}</h4>
                  <p className="result-description">{item.itemDescription}</p>
                  <div className="result-meta">
                    <span>Found at: {item.foundLocation}</span>
                    <span>Date: {formatDate(item.dateFound)}</span>
                  </div>
                </div>
                
                <div className="result-actions">
                  <button 
                    className="claim-button"
                    onClick={() => handleClaim(item._id)}
                  >
                    Claim Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar;