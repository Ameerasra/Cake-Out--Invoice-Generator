import React, { useState } from 'react';
import { InvoiceItem } from '../../types';
import './ItemEntryForm.css';

interface ItemEntryFormProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

const ItemEntryForm: React.FC<ItemEntryFormProps> = ({ items, onItemsChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>({
    item_name: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
  });

  const calculateTotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'quantity' || field === 'unit_price') {
        // Auto-calculate total when quantity or price changes
        updated.total_price = calculateTotal(
          field === 'quantity' ? (value as number) : updated.quantity,
          field === 'unit_price' ? (value as number) : updated.unit_price
        );
      }
      return updated;
    });
  };

  const handleAddItem = () => {
    if (!formData.item_name.trim()) {
      alert('Please enter an item name');
      return;
    }

    const newItem: InvoiceItem = {
      item_name: formData.item_name,
      quantity: formData.quantity,
      unit_price: formData.unit_price,
      total_price: calculateTotal(formData.quantity, formData.unit_price),
    };

    if (editingIndex !== null) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[editingIndex] = newItem;
      onItemsChange(updatedItems);
      setEditingIndex(null);
    } else {
      // Add new item
      onItemsChange([...items, newItem]);
    }

    // Reset form
    setFormData({
      item_name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    });
  };

  const handleEditItem = (index: number) => {
    const item = items[index];
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    });
    setEditingIndex(index);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onItemsChange(updatedItems);
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({
        item_name: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData({
      item_name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    });
  };

  return (
    <div className="item-entry-form">
      <h3>Invoice Items</h3>

      {/* Item Entry Form */}
      <div className="item-form">
        <div className="form-row">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) => handleInputChange('item_name', e.target.value)}
              placeholder="e.g., Chocolate Cake"
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="form-group">
            <label>Unit Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>Total</label>
            <input
              type="number"
              value={calculateTotal(formData.quantity, formData.unit_price).toFixed(2)}
              readOnly
              className="readonly"
            />
          </div>
          <div className="form-group form-actions">
            {editingIndex !== null ? (
              <>
                <button type="button" onClick={handleAddItem} className="btn btn-primary">
                  Update
                </button>
                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={handleAddItem} className="btn btn-primary">
                Add Item
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      {items.length > 0 && (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>${item.total_price.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditItem(index)}
                      className="btn btn-sm btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn btn-sm btn-danger"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && (
        <div className="no-items-message">
          No items added yet. Add items using the form above.
        </div>
      )}
    </div>
  );
};

export default ItemEntryForm;

