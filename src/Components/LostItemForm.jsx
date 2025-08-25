import React, { useState } from 'react';
import { FaArrowLeft, FaImage } from 'react-icons/fa';
import './LostItemForm.css';

const LostItemForm = ({ onBack }) => {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="lost-item-form-wrapper">
      <button className="back-btn" onClick={onBack}><FaArrowLeft /></button>
      <h2 className="form-title">LOST ITEM REPORT FORM</h2>
      <form className="lost-item-form" onSubmit={handleSubmit}>
        <div className="section-title">Item informations</div>
        <input type="text" name="itemName" placeholder="Item name" onChange={handleChange} />
        <div className="row">
          <input type="date" name="dateFound" placeholder="Date found" onChange={handleChange} />
          <input type="time" name="timeFound" placeholder="Time found" onChange={handleChange} />
        </div>
        <textarea name="locationDesc" placeholder="A brief description of location found..." onChange={handleChange} />
        <label className="upload-box">
          <FaImage className="upload-icon" />
          <span>Drag and drop to upload image</span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
        </label>
        <div className="section-title owner">Owner information</div>
        <div className="row">
          <input type="text" name="fullName" placeholder="Full name" onChange={handleChange} />
        </div>
        <div className="row">
          <input type="text" name="matricNumber" placeholder="Matric Number" onChange={handleChange} />
          <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
        </div>
        <div className="row">
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
        </div>
        <div className="checkbox-row">
          <label><input type="checkbox" name="shareInfo" /> I agree to share this information for recovery purpose</label>
          <label><input type="checkbox" name="adminContact" /> Admin can contact me for verification</label>
        </div>
        <button type="submit" className="submit-btn">SUBMIT</button>
      </form>
    </div>
  );
};

export default LostItemForm;
