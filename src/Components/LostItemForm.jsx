import React, { useState, useCallback } from 'react';
import { FaArrowLeft, FaImage, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';
import './LostItemForm.css';

const LostItemForm = ({ onBack }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all form fields
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Append the image file if it exists
    if (image) {
      formData.append('image', image);
    }

    // Here you would typically send formData to your backend
    console.log('Form submitted:', Object.fromEntries(formData.entries()));
    
    // Reset form after submission
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
  };

  return (
    <div className="lost-item-form-wrapper">
      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <FaArrowLeft />
      </button>
      
      <h2 className="form-title">LOST ITEM REPORT FOR</h2>
      
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
        <div className="section-title owner">Owner Information</div>
        
        <div className="form-group">
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input 
              type="text" 
              name="fullName" 
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
        
        <button type="submit" className="submit-btn">
          SUBMIT LOST ITEM REPORT
        </button>
      </form>
    </div>
  );
};

export default LostItemForm;
