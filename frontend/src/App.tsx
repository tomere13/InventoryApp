// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemList from './pages/ItemList';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/add" element={<AddItem />} />
        {/* Edit Item Route */}
        <Route path="/edit/:id" element={<EditItem />} />

        {/* Optional: 404 Not Found Route */}
        <Route path="*" element={<div>404 Not Found</div>} />      </Routes>
    </Router>
  );
};

export default App;