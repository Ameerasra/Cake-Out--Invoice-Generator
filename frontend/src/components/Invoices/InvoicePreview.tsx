import React, { useState } from 'react';
import { Invoice } from '../../types';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './InvoicePreview.css';
import logo from '../../assets/Logo.jpg';

interface InvoicePreviewProps {
  invoice: Invoice;
  onPrint?: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onPrint }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (isNaN(numericAmount)) {
      return '$0.00';
    }
    return `$${numericAmount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const input = document.getElementById('invoice-document');
    if (!input) {
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        windowHeight: input.scrollHeight
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Calculate negative offset
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoice.invoice_id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    const input = document.getElementById('invoice-document');
    if (!input) {
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        windowHeight: input.scrollHeight
      });
      const image = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Invoice_${invoice.invoice_id}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate Image');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="invoice-preview">
      <div className="invoice-actions">
        {onPrint && (
          <button onClick={onPrint} className="btn btn-secondary">
            Print
          </button>
        )}
        <button onClick={handleDownloadPDF} disabled={isDownloading} className="btn btn-primary">
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>
        <button onClick={handleDownloadImage} disabled={isDownloading} className="btn btn-secondary">
          {isDownloading ? 'Generating...' : 'Download JPG'}
        </button>
      </div>

      <div className="invoice-document" id="invoice-document">
        {/* Header */}
        <div className="invoice-header">
          <div className="invoice-header-left">
            <div className="invoice-logo-container">
              <img src={logo} alt="Logo" className="invoice-logo" width={100} height={100} style={{ borderRadius: '50%' }} />
              <h1>Cake Out</h1>
              <h2>Your Happiness, Our Cakes</h2>
            </div>
            <p className="business-info">
              No: 255/6c, 12 Cross street,<br />
              Mannar road, Puttalam.<br />
              Phone: 077-9913067<br />
              Email: cakeout@gmail.com
            </p>
          </div>
          <div className="invoice-header-right">
            <h2>INVOICE</h2>
            <div className="invoice-meta">
              <div className="meta-row">
                <span className="meta-label">Invoice ID:</span>
                <span className="meta-value">{invoice.invoice_id}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Order ID:</span>
                <span className="meta-value">{invoice.order_id}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Invoice Date:</span>
                <span className="meta-value">{formatDate(invoice.invoice_date)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Ordered Date:</span>
                <span className="meta-value">{formatDate(invoice.ordered_date)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Status:</span>
                <span className={`meta-value status-${invoice.status}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="invoice-section">
          <h3>Bill To:</h3>
          <div className="customer-info-grid">
            <div className="info-row">
              <span className="info-label">Customer ID:</span>
              <span className="info-value">{invoice.customer?.id ? `CUST-${invoice.customer.id.toString().padStart(4, '0')}` : 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Customer Name:</span>
              <span className="info-value highlight">{invoice.customer?.name || 'N/A'}</span>
            </div>
            {invoice.customer?.phone && (
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{invoice.customer.phone}</span>
              </div>
            )}
            {invoice.customer?.email && (
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{invoice.customer.email}</span>
              </div>
            )}
            {invoice.customer?.address && (
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">{invoice.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-section">
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td data-label="Item Name">{item.item_name}</td>
                  <td className="text-right" data-label="Quantity">{item.quantity}</td>
                  <td className="text-right" data-label="Unit Price">{formatCurrency(item.unit_price)}</td>
                  <td className="text-right" data-label="Total">{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.discount && invoice.discount > 0 ? (
            <div className="summary-row">
              <span>Discount:</span>
              <span>-{formatCurrency(invoice.discount)}</span>
            </div>
          ) : null}
          {invoice.delivery_charge && invoice.delivery_charge > 0 ? (
            <div className="summary-row">
              <span>Delivery Charge:</span>
              <span>{formatCurrency(invoice.delivery_charge)}</span>
            </div>
          ) : null}
          {invoice.tax && invoice.tax > 0 ? (
            <div className="summary-row">
              <span>Tax:</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
          ) : null}
          <div className="summary-row total">
            <span>Grand Total:</span>
            <span>{formatCurrency(invoice.grand_total)}</span>
          </div>
        </div>

        {/* Payment Information */}
        <div className="invoice-section payment-section">
          <h3>Payment Information</h3>
          <div className="payment-details">
            <div className="payment-row">
              <span>Payment Method:</span>
              <span>{invoice.payment_method || 'N/A'}</span>
            </div>
            <div className="payment-row">
              <span>Payment Status:</span>
              <span className={`status-badge status-${invoice.payment_status.toLowerCase().replace(' ', '-')}`}>
                {invoice.payment_status}
              </span>
            </div>
            {invoice.advance_payment && invoice.advance_payment > 0 ? (
              <div className="payment-row">
                <span>Advance Payment:</span>
                <span>{formatCurrency(invoice.advance_payment)}</span>
              </div>
            ) : null}
            <div className="payment-row">
              <span>Balance Amount:</span>
              <span className="balance-amount">{formatCurrency(invoice.balance_amount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {invoice.delivery_type && (
          <div className="invoice-section">
            <h3>{invoice.delivery_type === 'pickup' ? 'Pickup Information' : 'Delivery Information'}</h3>
            <div className="delivery-details">
              <div className="delivery-row">
                <span>Type:</span>
                <span className="delivery-type">{invoice.delivery_type.toUpperCase()}</span>
              </div>

              {/* Common fields for both Delivery and Pickup (mapped to delivery_date/time in backend) */}
              {invoice.delivery_date && (
                <div className="delivery-row">
                  <span>{invoice.delivery_type === 'pickup' ? 'Order Pickup Date:' : 'Delivery Date:'}</span>
                  <span>{formatDate(invoice.delivery_date)}</span>
                </div>
              )}
              {invoice.delivery_time && (
                <div className="delivery-row">
                  <span>{invoice.delivery_type === 'pickup' ? 'Order Pickup Time:' : 'Delivery Time:'}</span>
                  <span>{formatTime(invoice.delivery_time)}</span>
                </div>
              )}

              {/* Address only for delivery */}
              {invoice.delivery_type === 'delivery' && invoice.delivery_address && (
                <div className="delivery-row">
                  <span>Delivery Address:</span>
                  <span>{invoice.delivery_address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <p className="footer-note">This is a computer-generated invoice.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;

