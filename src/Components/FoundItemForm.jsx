import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportFoundItem } from '../services/api';
import { FaArrowLeft, FaImage, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import './FoundItemForm.css';

const FoundItemForm = ({ onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: '',
    dateFound: '',
    timeFound: '',
    foundLocation: '',
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
    if (!form.itemName || !form.dateFound || !form.timeFound || !form.foundLocation || 
        !form.itemDescription || !form.fullName || !form.phoneNumber || !form.email) {
      setSubmitStatus({ success: false, message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const formData = new FormData();
      
      // Append all form fields with proper field names for found items
      Object.entries({
        ...form,
        // Map form fields to match backend expectations
        dateFound: form.dateFound,
        timeFound: form.timeFound,
        foundLocation: form.foundLocation,
        itemName: form.itemName,
        itemDescription: form.itemDescription,
        fullName: form.fullName,
        matricNumber: form.matricNumber,
        phoneNumber: form.phoneNumber,
        email: form.email,
        shareInfo: form.shareInfo,
        adminContact: form.adminContact,
        status: 'found'  // Explicitly set status to 'found'
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
      const response = await reportFoundItem(formData);
      
      // Show popup message
      setShowPopup(true);
      
      // Reset form after successful submission
      setForm({
        itemName: '',
        dateFound: '',
        timeFound: '',
        foundLocation: '',
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
    <div className="found-item-form-wrapper">
      {/* Popup Message */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-message">
            <h3>Submission Successful!</h3>
            <p>Thank you, Admin will update you if necessary.</p>
            <button className="popup-close-btn" onClick={handlePopupClose}>
              OK
            </button>
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <FaArrowLeft />
      </button>
      
      <h2 className="form-title">FOUND ITEM REPORT FORM</h2>

      <hr style={{width: '97%', maxWidth: 1020, borderColor: '#000000', margin: '24px auto'}} />
      
      <form className="found-item-form" onSubmit={handleSubmit}>
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
                name="dateFound" 
                value={form.dateFound}
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
                name="timeFound" 
                value={form.timeFound}
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
              name="foundLocation" 
              value={form.foundLocation}
              placeholder="Where was the item found?" 
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <textarea 
            name="itemDescription" 
            value={form.itemDescription}
            placeholder="Detailed description of the item (color, brand, distinguishing features, condition, etc.)..." 
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
              style={{ display: 'none' }} 
            />
          </label>
        </div>
        
        {/* Finder's Information Section */}
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
            <span className="checkbox-label">I agree to share this information for recovery purpose</span>
          </label>
          
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              name="adminContact" 
              checked={form.adminContact}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <span className="checkbox-label" >Admin can contact me for verification</span>
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
  );
};

export default FoundItemForm;
