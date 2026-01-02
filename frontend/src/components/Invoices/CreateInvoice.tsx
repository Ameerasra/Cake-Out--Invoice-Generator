import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { InvoiceFormData, InvoiceItem, Customer } from '../../types';
import { invoiceApi } from '../../services/api/invoices';
import CustomerAutocomplete from '../Customers/CustomerAutocomplete';
import ItemEntryForm from './ItemEntryForm';
import './CreateInvoice.css';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoice_date: format(new Date(), 'yyyy-MM-dd'),
    ordered_date: format(new Date(), 'yyyy-MM-dd'),
    items: [],
    subtotal: 0,
    discount: 0,
    delivery_charge: 0,
    tax: 0,
    grand_total: 0,
    payment_status: 'Due',
    advance_payment: 0,
    status: 'draft',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerNameInput, setCustomerNameInput] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

  // Calculate pricing whenever items or other fields change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total_price, 0);
    const discountAmount = formData.discount || 0;
    const deliveryAmount = formData.delivery_charge || 0;
    const taxAmount = formData.tax || 0;
    const grandTotal = subtotal - discountAmount + deliveryAmount + taxAmount;
    const balance = grandTotal - (formData.advance_payment || 0);

    setFormData((prev) => ({
      ...prev,
      subtotal,
      grand_total: grandTotal,
      balance_amount: balance,
    }));
  }, [formData.items, formData.discount, formData.delivery_charge, formData.tax, formData.advance_payment]);

  // Validate ordered_date <= invoice_date
  useEffect(() => {
    if (formData.ordered_date && formData.invoice_date) {
      const orderedDate = new Date(formData.ordered_date);
      const invoiceDate = new Date(formData.invoice_date);
      if (orderedDate > invoiceDate) {
        setDateError('Ordered date must be less than or equal to invoice date');
      } else {
        setDateError(null);
      }
    }
  }, [formData.ordered_date, formData.invoice_date]);

  const handleInputChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setCustomerNameInput(customer.name);
      setFormData((prev) => ({ ...prev, customer_id: customer.id }));
    } else {
      setFormData((prev) => {
        const { customer_id, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleItemsChange = (items: InvoiceItem[]) => {
    setFormData((prev) => ({ ...prev, items }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'final') => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.ordered_date) {
      setError('Ordered date is required');
      return;
    }

    if (dateError) {
      setError(dateError);
      return;
    }

    if (formData.items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    // Validate Delivery/Pickup
    if (!formData.delivery_type) {
      setError('Please select Delivery or Pickup');
      return;
    }

    if (formData.delivery_type === 'pickup') {
      if (!formData.delivery_date || !formData.delivery_time) {
        setError('Pickup Date and Time are required');
        return;
      }
    } else if (formData.delivery_type === 'delivery') {
      if (!formData.delivery_date || !formData.delivery_time) {
        setError('Delivery Date and Time are required');
        return;
      }
      if (!formData.delivery_address) {
        setError('Delivery Address is required');
        return;
      }
    }

    // Handle customer - if no customer selected but name is entered, create new customer
    if (!selectedCustomer) {
      if (!customerNameInput.trim()) {
        setError('Please select or enter a customer name');
        return;
      }
      // Will create new customer via backend
      formData.customer = {
        name: customerNameInput.trim(),
      };
    }

    setIsSubmitting(true);

    try {
      const submitData: InvoiceFormData = {
        ...formData,
        status,
      };

      if (selectedCustomer) {
        submitData.customer_id = selectedCustomer.id;
      }

      const invoice = await invoiceApi.create(submitData);
      navigate(`/invoices/${invoice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-invoice">
      <h2>Create New Invoice</h2>

      {error && <div className="error-alert">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e, 'final')} className="invoice-form">
        {/* Date Fields */}
        <div className="form-section">
          <h3>Invoice & Order Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoice_date">Invoice Date *</label>
              <input
                type="date"
                id="invoice_date"
                value={formData.invoice_date}
                onChange={(e) => handleInputChange('invoice_date', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ordered_date">Ordered Date *</label>
              <input
                type="date"
                id="ordered_date"
                value={formData.ordered_date}
                onChange={(e) => handleInputChange('ordered_date', e.target.value)}
                required
              />
              {dateError && <span className="field-error">{dateError}</span>}
            </div>
          </div>
        </div>

        {/* Customer Selection */}
        <div className="form-section">
          <h3>Customer Information</h3>
          <CustomerAutocomplete
            value={selectedCustomer}
            onChange={handleCustomerChange}
            onInputChange={(name) => setCustomerNameInput(name)}
            inputValue={customerNameInput}
            required
          />
        </div>

        {/* Items */}
        <ItemEntryForm items={formData.items} onItemsChange={handleItemsChange} />

        {/* Pricing Summary */}
        <div className="form-section">
          <h3>Pricing Summary</h3>
          <div className="pricing-summary">
            <div className="pricing-row">
              <span>Subtotal:</span>
              <span>${formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="pricing-row">
              <label htmlFor="discount">Discount:</label>
              <input
                type="number"
                id="discount"
                min="0"
                step="0.01"
                value={formData.discount || 0}
                onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                className="pricing-input"
              />
            </div>
            <div className="pricing-row">
              <label htmlFor="delivery_charge">Delivery Charge:</label>
              <input
                type="number"
                id="delivery_charge"
                min="0"
                step="0.01"
                value={formData.delivery_charge || 0}
                onChange={(e) => handleInputChange('delivery_charge', parseFloat(e.target.value) || 0)}
                className="pricing-input"
              />
            </div>
            <div className="pricing-row">
              <label htmlFor="tax">Tax:</label>
              <input
                type="number"
                id="tax"
                min="0"
                step="0.01"
                value={formData.tax || 0}
                onChange={(e) => handleInputChange('tax', parseFloat(e.target.value) || 0)}
                className="pricing-input"
              />
            </div>
            <div className="pricing-row total">
              <span>Grand Total:</span>
              <span>${formData.grand_total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="form-section">
          <h3>Payment Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payment_method">Payment Method</label>
              <select
                id="payment_method"
                value={formData.payment_method || ''}
                onChange={(e) => handleInputChange('payment_method', e.target.value || undefined)}
              >
                <option value="">Select method</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="payment_status">Payment Status</label>
              <select
                id="payment_status"
                value={formData.payment_status}
                onChange={(e) => handleInputChange('payment_status', e.target.value as any)}
              >
                <option value="Due">Due</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="advance_payment">Advance Payment</label>
              <input
                type="number"
                id="advance_payment"
                min="0"
                step="0.01"
                value={formData.advance_payment || 0}
                onChange={(e) => handleInputChange('advance_payment', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="form-group">
              <label>Balance Amount</label>
              <input
                type="text"
                value={`$${((formData.grand_total || 0) - (formData.advance_payment || 0)).toFixed(2)}`}
                readOnly
                className="readonly"
              />
            </div>
          </div>
        </div>

        {/* Delivery/Pickup */}
        <div className="form-section">
          <h3>Delivery / Pickup Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="delivery_type"
                    value="delivery"
                    checked={formData.delivery_type === 'delivery'}
                    onChange={(e) => handleInputChange('delivery_type', e.target.value)}
                  />
                  Delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="delivery_type"
                    value="pickup"
                    checked={formData.delivery_type === 'pickup'}
                    onChange={(e) => handleInputChange('delivery_type', e.target.value)}
                  />
                  Pickup
                </label>
              </div>
            </div>
          </div>

          {formData.delivery_type === 'delivery' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="delivery_date">Delivery Date *</label>
                  <input
                    type="date"
                    id="delivery_date"
                    value={formData.delivery_date || ''}
                    onChange={(e) => handleInputChange('delivery_date', e.target.value || undefined)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="delivery_time">Delivery Time *</label>
                  <input
                    type="time"
                    id="delivery_time"
                    value={formData.delivery_time || ''}
                    onChange={(e) => handleInputChange('delivery_time', e.target.value || undefined)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="delivery_address">Delivery Address *</label>
                <textarea
                  id="delivery_address"
                  rows={3}
                  value={formData.delivery_address || ''}
                  onChange={(e) => handleInputChange('delivery_address', e.target.value || undefined)}
                  required
                />
              </div>
            </>
          )}

          {formData.delivery_type === 'pickup' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickup_date">Order Pickup Date *</label>
                <input
                  type="date"
                  id="pickup_date"
                  // Reuse delivery_date field for storage but show different label
                  value={formData.delivery_date || ''}
                  onChange={(e) => handleInputChange('delivery_date', e.target.value || undefined)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pickup_time">Order Pickup Time *</label>
                <input
                  type="time"
                  id="pickup_time"
                  // Reuse delivery_time field for storage
                  value={formData.delivery_time || ''}
                  onChange={(e) => handleInputChange('delivery_time', e.target.value || undefined)}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            Save as Draft
          </button>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;

