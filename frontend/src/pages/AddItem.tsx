// src/pages/AddItem.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { IItem } from '../types';
import { useNavigate } from 'react-router-dom';

const AddItem: React.FC = () => {
  const [item, setItem] = useState<IItem>({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Trying to add\n");
    
    e.preventDefault();
    axios
      .post<IItem>('/api/items', item)
      .then((response) => {
        console.log(response.data);
        navigate('/');
      })
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Item</h2>
      <label>Name:</label>
      <input type="text" name="name" onChange={handleChange} required />
      <label>Description:</label>
      <textarea name="description" onChange={handleChange} />
      <label>Quantity:</label>
      <input
        type="number"
        name="quantity"
        onChange={handleChange}
        required
      />
      <label>Price:</label>
      <input type="number" name="price" onChange={handleChange} />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItem;