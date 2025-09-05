import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoundItems } from '../services/api';
import '../App.css';

const RecentItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      setLoading(true);
      const response = await getFoundItems();
      setItems(response.data || []);
    } catch (err) {
      setError('Failed to load recent items');
      console.error('Error fetching recent items:', err);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleShowItems = () => {
    setShowItems(!showItems);
  };

  if (loading) {
    return (
      <div className="recent-items-section">
        <div className="recent-items-header">
          <h3>History of recently found items</h3>
          <button className="see-all-btn" disabled>
            Loading...
          </button>
        </div>
      </div>
    );
  }
   
  if (error) {
    return (
      <div className="recent-items-section">
        <div className="recent-items-header">
          <h3>History of recently found items</h3>
          <button className="see-all-btn" disabled>
            Error
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-items-section">
      <div className="recent-items-header">
        <h3>History of recently found items</h3>
        <button 
          className="see-all-btn"
          onClick={toggleShowItems}
        >
          {showItems ? 'Hide Items' : 'See it all'}
        </button>
      </div>
      
      {showItems && (
        <>
          {items.length === 0 ? (
            <div className="no-items-message">
              No items found yet. Be the first to report a found item!
            </div>
          ) : (
            <div className="recent-items-grid">
              {items.map((item) => (
                <div key={item._id} className="recent-item-card">
                  <div className="recent-item-image">
                    {item.image ? (
                      <img 
                        src={`http://localhost:5000${item.image}`} 
                        alt={item.itemName}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="no-image-placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                      No Image
                    </div>
                  </div>
                  
                  <div className="recent-item-details">
                    <h4>{item.itemName}</h4>
                    <p className="item-description">{item.itemDescription}</p>
                    <div className="item-meta">
                      <span className="location">📍 {item.foundLocation}</span>
                      <span className="date">🗓️ {formatDate(item.dateFound)}</span>
                    </div>
                  </div>
                  
                  <div className="recent-item-actions">
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
          )}
        </>
      )}
    </div>
  );
};

export default RecentItems;
