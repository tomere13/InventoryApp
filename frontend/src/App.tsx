// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemList from './pages/ItemList';
import AddItem from './pages/AddItem';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/add" element={<AddItem />} />
      </Routes>
    </Router>
  );
};

export default App;