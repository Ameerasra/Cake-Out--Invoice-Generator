import apiClient from './axios';
import { Customer } from '../../types';

export const customerApi = {
  // Search customers
  search: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>('/customers/search', {
      params: { q: query }
    });
    return response.data;
  },

  // Get all customers
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>('/customers');
    return response.data;
  },

  // Create customer
  create: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/customers', customer);
    return response.data;
  },

  // Get customer by ID
  getById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  }
};

