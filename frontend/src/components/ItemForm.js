import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/itemsSlice';

const ItemForm = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim()) {
      dispatch(addItem({ title, done: false }));
      setTitle('');
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new item..."
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default ItemForm;
