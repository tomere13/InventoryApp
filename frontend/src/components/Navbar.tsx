// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <h2>Inventory Management</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add">Add Item</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;