import apiClient from './axios';
import { Invoice, InvoiceFormData } from '../../types';

export const invoiceApi = {
  // Get all invoices
  getAll: async (status?: string): Promise<Invoice[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<Invoice[]>('/invoices', { params });
    return response.data;
  },

  // Get invoice by ID
  getById: async (id: number): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  // Create invoice
  create: async (invoice: InvoiceFormData): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>('/invoices', invoice);
    return response.data;
  },

  // Update invoice
  update: async (id: number, invoice: Partial<InvoiceFormData>): Promise<Invoice> => {
    const response = await apiClient.put<Invoice>(`/invoices/${id}`, invoice);
    return response.data;
  },

  // Delete invoice
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
  },
};

