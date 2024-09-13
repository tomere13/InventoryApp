// src/pages/ItemList.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IItem } from '../types';
import { Link } from 'react-router-dom';

const ItemList: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    axios
      .get<IItem[]>('/api/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                <Link to={`/edit/${item._id}`}>Edit</Link> |{' '}
                <button onClick={() => deleteItem(item._id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function deleteItem(id: string) {
    axios
      .delete(`/api/items/${id}`)
      .then(() => setItems(items.filter((item) => item._id !== id)))
      .catch((error) => console.error(error));
  }
};

export default ItemList;