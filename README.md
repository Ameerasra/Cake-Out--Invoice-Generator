# Cake Bakery Invoice Generator

A full-stack invoice generator system for cake bakery businesses with automatic invoice/order ID generation, customer management, and dynamic item entry.

## Features

- ✅ Automatic Invoice ID and Order ID generation
- ✅ Invoice Date (auto-filled, editable) and Ordered Date (mandatory, validated)
- ✅ Customer autocomplete/search with auto-save for new customers
- ✅ Dynamic item entry with add/edit/remove functionality
- ✅ Real-time pricing calculations (subtotal, discount, delivery, tax, grand total, balance)
- ✅ Payment tracking (method, status, advance payment, balance)
- ✅ Delivery/Pickup management with conditional fields
- ✅ Professional invoice preview with print-friendly styling
- ✅ Responsive design for desktop and mobile
- ✅ Breadcrumb navigation

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Laravel (PHP)
- **Database**: MySQL

## Project Structure

```
Cake-Out--Invoice-Generator/
├── backend/          # Laravel API
├── frontend/         # React application
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy `.env.example` to `.env` (if not already done):
   ```bash
   cp .env.example .env
   ```

3. Update `.env` file with your MySQL database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. Install dependencies (if not already installed):
   ```bash
   composer install
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Run migrations:
   ```bash
   php artisan migrate
   ```

7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (optional, defaults to `http://localhost:8000/api`):
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Create Invoice**: Navigate to "Create New Invoice" from the dashboard
2. **Select/Enter Customer**: Use the autocomplete to search for existing customers or enter a new customer name
3. **Add Items**: Add invoice items with quantity and unit price (total calculated automatically)
4. **Set Pricing**: Configure discount, delivery charge, and tax as needed
5. **Payment Details**: Select payment method, status, and enter advance payment
6. **Delivery/Pickup**: Choose delivery or pickup and fill in relevant details
7. **Save**: Save as draft or create final invoice

## API Endpoints

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/search?q={query}` - Search customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer by ID
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/{id}` - Get invoice by ID
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice

## Database Schema

### customers
- id, name, phone, address, created_at, updated_at

### invoices
- id, invoice_id (unique), order_id (unique), invoice_date, ordered_date, customer_id, subtotal, discount, delivery_charge, tax, grand_total, payment_method, payment_status, advance_payment, balance_amount, delivery_type, delivery_date, delivery_time, delivery_address, status, created_at, updated_at

### invoice_items
- id, invoice_id, item_name, quantity, unit_price, total_price, created_at, updated_at

## Development

### Backend
- Laravel 12.x
- PHP 8.2+
- MySQL 5.7+

### Frontend
- React 18.x
- TypeScript
- React Router DOM
- Axios
- date-fns

## License

MIT License
