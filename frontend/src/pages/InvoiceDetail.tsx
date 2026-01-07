import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice } from '../types';
import { invoiceApi } from '../services/api/invoices';
import InvoicePreview from '../components/Invoices/InvoicePreview';
import './InvoiceDetail.css';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoiceApi.getById(parseInt(id!));
      setInvoice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Invoice not found'}</div>
        <button onClick={() => navigate('/invoices')} className="btn btn-primary">
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-detail">
      <div className="invoice-detail-header">
        <button onClick={() => navigate('/invoices')} className="btn btn-secondary">
          ← Back to Invoices
        </button>
      </div>
      <InvoicePreview invoice={invoice} onPrint={handlePrint} />
    </div>
  );
};

export default InvoiceDetail;






