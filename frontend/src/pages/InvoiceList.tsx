import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Invoice } from '../types';
import { invoiceApi } from '../services/api/invoices';
import { format } from 'date-fns';
import './InvoiceList.css';

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadInvoices = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoiceApi.getAll(statusFilter || undefined);
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (isNaN(numericAmount)) {
      return '$0.00'; // Or handle error case as needed, e.g., throw an error or return 'N/A'
    }
    return `$${numericAmount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    return `payment-status-badge status-${status.toLowerCase().replace(' ', '-')}`;
  };

  if (isLoading) {
    return <div className="loading">Loading invoices...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="invoice-list">
      <div className="invoice-list-header">
        <h2>All Invoices</h2>
        <Link to="/invoices/create" className="btn btn-primary">
          Create New Invoice
        </Link>
      </div>

      <div className="filters">
        <label>
          Filter by Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="final">Final</option>
          </select>
        </label>
      </div>

      {invoices.length === 0 ? (
        <div className="no-invoices">
          <p>No invoices found.</p>
          <Link to="/invoices/create" className="btn btn-primary">
            Create Your First Invoice
          </Link>
        </div>
      ) : (
        <div className="invoices-table-container">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Invoice Date</th>
                <th>Grand Total</th>
                <th>Payment Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoice_id}</td>
                  <td>{invoice.order_id}</td>
                  <td>{invoice.customer?.name || 'N/A'}</td>
                  <td>{formatDate(invoice.invoice_date)}</td>
                  <td className="amount">{formatCurrency(invoice.grand_total)}</td>
                  <td>
                    <span className={getPaymentStatusBadgeClass(invoice.payment_status)}>
                      {invoice.payment_status}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="btn btn-sm btn-view"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;






