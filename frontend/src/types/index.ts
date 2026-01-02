export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id?: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: number;
  invoice_id: string;
  order_id: string;
  invoice_date: string;
  ordered_date: string;
  customer_id: number;
  customer?: Customer;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  delivery_charge?: number;
  tax?: number;
  grand_total: number;
  payment_method?: 'Cash' | 'Card' | 'Bank Transfer' | 'Online';
  payment_status: 'Paid' | 'Partially Paid' | 'Due';
  advance_payment?: number;
  balance_amount: number;
  delivery_type?: 'delivery' | 'pickup';
  delivery_date?: string;
  delivery_time?: string;
  delivery_address?: string;
  status: 'draft' | 'final';
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceFormData {
  invoice_date: string;
  ordered_date: string;
  customer_id?: number;
  customer?: {
    name: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  delivery_charge?: number;
  tax?: number;
  grand_total: number;
  payment_method?: 'Cash' | 'Card' | 'Bank Transfer' | 'Online';
  payment_status?: 'Paid' | 'Partially Paid' | 'Due';
  advance_payment?: number;
  delivery_type?: 'delivery' | 'pickup';
  delivery_date?: string;
  delivery_time?: string;
  delivery_address?: string;
  status?: 'draft' | 'final';
}
