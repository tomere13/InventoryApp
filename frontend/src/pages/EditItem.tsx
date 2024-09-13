// src/pages/EditItem.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IItem } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

const EditItem: React.FC = () => {
  const [item, setItem] = useState<IItem>({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch the existing item data when the component mounts
  useEffect(() => {
    axios
      .get<IItem>(`/api/items/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => console.error('Error fetching item:', error));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
        .patch<IItem>(`/api/items/${id}`, item)
        .then((response) => {
        console.log('Item updated:', response.data);
        navigate('/');
      })
      .catch((error) => console.error('Error updating item:', error));
  };

  // Show a loading message if the item data hasn't been fetched yet
  if (!item.name && !item.description && item.quantity === 0 && item.price === 0) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Item</h2>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={item.name}
        onChange={handleChange}
        required
      />
      <label>Description:</label>
      <textarea
        name="description"
        value={item.description}
        onChange={handleChange}
      />
      <label>Quantity:</label>
      <input
        type="number"
        name="quantity"
        value={item.quantity}
        onChange={handleChange}
        required
      />
      <label>Price:</label>
      <input
        type="number"
        name="price"
        value={item.price}
        onChange={handleChange}
      />
      <button type="submit">Update Item</button>
    </form>
  );
};

export default EditItem;