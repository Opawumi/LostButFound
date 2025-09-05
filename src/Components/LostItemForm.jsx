import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { reportLostItem } from '../services/api';
import { FaArrowLeft, FaImage, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import './LostItemForm.css';

const LostItemForm = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isClaimMode = location.state?.isClaimMode || false;
  const claimingItemId = location.state?.claimingItem;
  
  const [form, setForm] = useState({
    itemName: '',
    dateLost: '',
    timeLost: '',
    lastLocation: '',
    itemDescription: '',
    fullName: '',
    matricNumber: '',
    phoneNumber: '',
    email: '',
    shareInfo: false,
    adminContact: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isClaimMode) {
      // Pre-fill some fields or show different UI for claim mode
      setForm(prev => ({
        ...prev,
        adminContact: true // Auto-check admin contact for claims
      }));
    }
  }, [isClaimMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0] || (e.dataTransfer?.files?.[0]);
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleImageChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!form.itemName || !form.dateLost || !form.timeLost || !form.lastLocation || 
        !form.itemDescription || !form.fullName || !form.phoneNumber || !form.email) {
      setSubmitStatus({ success: false, message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const formData = new FormData();
      
      // Append all form fields with proper field names for lost items
      Object.entries({
        ...form,
        // Map form fields to match backend expectations
        dateLost: form.dateLost,
        timeLost: form.timeLost,
        lastLocation: form.lastLocation,
        itemName: form.itemName,
        itemDescription: form.itemDescription,
        fullName: form.fullName,
        matricNumber: form.matricNumber,
        phoneNumber: form.phoneNumber,
        email: form.email,
        shareInfo: form.shareInfo,
        adminContact: form.adminContact,
        status: 'lost',  // Explicitly set status to 'lost'
        claimingItemId: isClaimMode ? claimingItemId : undefined // Add claiming item ID if in claim mode
      }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Append the image file if it exists
      if (image) {
        formData.append('image', image);
      }

      // Send to backend
      const response = await reportLostItem(formData);
      
      if (isClaimMode) {
        // Show popup for claim mode
        setShowPopup(true);
      } else {
        // Show success message for regular lost item report
        setSubmitStatus({ 
          success: true, 
          message: 'Lost item reported successfully! We will notify you if it\'s found.' 
        });
      }
      
      // Reset form after successful submission
      setForm({
        itemName: '',
        dateLost: '',
        timeLost: '',
        lastLocation: '',
        itemDescription: '',
        fullName: '',
        matricNumber: '',
        phoneNumber: '',
        email: '',
        shareInfo: false,
        adminContact: false
      });
      setImage(null);
      setImagePreview(null);
      
      if (!isClaimMode) {
        // Clear success message after 5 seconds for regular mode
        setTimeout(() => {
          setSubmitStatus({ success: null, message: '' });
        }, 5000);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to submit form. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/'); // Navigate back to homepage
  };

  return (
    <div className="lost-item-form-wrapper">
      {/* Popup Message */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-message">
            <h3>Claim Submitted Successfully!</h3>
            <p>Admin will contact you after validation of your claim details.</p>
            <button className="popup-close-btn" onClick={handlePopupClose}>
              OK
            </button>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <FaArrowLeft />
      </button>
      
      <div className="lost-item-form-container">
        <h1 className="form-title">
          {isClaimMode ? 'Claim Item - Fill Your Details' : 'Report Lost Item'}
        </h1>
        
        {isClaimMode && (
          <div className="claim-notice">
            <p>Please fill in your details to claim this item. Admin will verify your information before processing the claim.</p>
          </div>
        )}

        <form className="lost-item-form" onSubmit={handleSubmit}>
          {/* Item Information Section */}
          <div className="section-title">Item Information</div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input 
                type="text" 
                name="itemName" 
                value={form.itemName}
                placeholder="Item name" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="row">
            <div className="form-group">
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input 
                  type="date" 
                  name="dateLost" 
                  value={form.dateLost}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <FaClock className="input-icon" />
                <input 
                  type="time" 
                  name="timeLost" 
                  value={form.timeLost}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input 
                type="text" 
                name="lastLocation" 
                value={form.lastLocation}
                placeholder="Last known location" 
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <textarea 
              name="itemDescription" 
              value={form.itemDescription}
              placeholder="Detailed description of the item (color, brand, distinguishing features, etc.)..." 
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label 
              className={`upload-box ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <div className="image-overlay">
                    <FaImage className="upload-icon" />
                    <span>Click or drag to change image</span>
                  </div>
                </div>
              ) : (
                <>
                  <FaImage className="upload-icon" />
                  <span>Drag and drop image here or click to browse</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="file-input"
              />
            </label>
          </div>
          
          {/* Owner Information Section */}
          <div className='owner-info-section'>
            <div className="section-title-owner">Enter your details</div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input 
                  type="text" 
                  name="fullName"
                  style={{ borderRadius: '18px' }}
                  value={form.fullName}
                  placeholder="Full name" 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="row">
              <div className="form-group">
                <div className="input-with-icon">
                  <FaIdCard className="input-icon" />
                  <input 
                    type="text" 
                    name="matricNumber" 
                    value={form.matricNumber}
                    placeholder="Matric Number" 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <FaPhone className="input-icon" />
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={form.phoneNumber}
                    placeholder="Phone Number" 
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input 
                  type="email" 
                  name="email" 
                  value={form.email}
                  placeholder="Email Address" 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>
                    
          
          <div className="checkbox-group">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                name="shareInfo" 
                checked={form.shareInfo}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">I agree to share this information for recovery purposes</span>
            </label>
            
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                name="adminContact" 
                checked={form.adminContact}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">Admin can contact me for verification</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
          
          {submitStatus.message && (
            <div className={`submit-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LostItemForm;
