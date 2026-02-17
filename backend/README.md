# Namma Kari Kadai Backend

This is the Express.js backend for the Chicken Shop application.

## Prerequisites

- Node.js
- MongoDB Atlas URI
- Redis URI

## Installation

1.  Navigate to `backend` directory.
2.  Run `npm install`.

## Running Locally

1.  Create `.env` file based on `.env.example`.
2.  Run `npm run dev` for development mode with nodemon.
3.  Run `npm start` for production mode.

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh Access Token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user

### Products
- `GET /api/products` - Get all products (Cached)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/myorders` - Get my orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update status (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
