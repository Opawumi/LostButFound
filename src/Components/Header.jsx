import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header">
      <FaBars className="icon menu-icon" />
      
      <div className="user-info">
        <FaUserCircle className="icon user-avatar" />
        <div className="user-text">
          <div className="greeting">Hello</div>
          <div className="username">Vicky.K</div>
        </div>
      </div>

      <FaBell className="icon bell-icon" />
    </header>
  );
};

export default Header;
