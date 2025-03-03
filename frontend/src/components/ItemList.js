import React from 'react';
import { useDispatch } from 'react-redux';
import { updateItem, deleteItem } from '../redux/itemsSlice';

const ItemList = ({ items }) => {
  const dispatch = useDispatch();

  const handleToggle = (item) => {
    dispatch(updateItem({
      ...item,
      done: !item.done
    }));
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  if (items.length === 0) {
    return <div className="item-list">No items yet. Add some!</div>;
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <div key={item.id} className="item">
          <h3 className={`item-title ${item.done ? 'completed' : ''}`}>
            {item.title}
          </h3>
          <div className="item-actions">
            <button
              className="btn btn-toggle"
              onClick={() => handleToggle(item)}
            >
              {item.done ? 'Undo' : 'Complete'}
            </button>
            <button
              className="btn btn-delete"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
