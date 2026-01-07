# Backend Setup Instructions

## Database Configuration

Update your `.env` file with MySQL database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## CORS Configuration

CORS is configured in `bootstrap/app.php` to allow requests from the React frontend. The default configuration allows all origins. For production, update the CORS settings in `config/cors.php` if needed.

## Running Migrations

After configuring your database, run:

```bash
php artisan migrate
```

## Starting the Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`






