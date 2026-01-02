# Troubleshooting Guide

## 500 Internal Server Error

If you're getting 500 errors from the API, check the following:

### 1. Database Configuration

Make sure your `.env` file has the correct database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 2. Run Migrations

Make sure you've created the database and run migrations:

```bash
php artisan migrate
```

### 3. Check Laravel Logs

Check the error logs for detailed error messages:

```bash
# On Windows
type storage\logs\laravel.log

# Or check the latest log file
```

### 4. Clear Cache

Clear Laravel cache and config:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 5. Check CORS Configuration

The CORS config file should be at `config/cors.php` and should allow `http://localhost:3000`.

### 6. Verify Database Tables Exist

Make sure the following tables exist in your database:
- `customers`
- `invoices`
- `invoice_items`

You can check by running:

```bash
php artisan tinker
>>> DB::table('customers')->count()
```

## Common Issues

### Issue: "Table doesn't exist"
**Solution**: Run `php artisan migrate`

### Issue: "Connection refused"
**Solution**: Check your MySQL server is running and credentials are correct

### Issue: "Class not found"
**Solution**: Run `composer dump-autoload`

### Issue: CORS errors
**Solution**: Make sure `config/cors.php` allows your frontend origin





