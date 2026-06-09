# 🛒 ShopEngine

A modern full-stack e-commerce platform built to provide a seamless online shopping experience. ShopEngine includes product categorization, secure payments, coupon management, cart functionality, an admin dashboard, and a responsive user interface.

## 🚀 Features

### 👥 User Features

* User Authentication & Authorization
* Browse Products by Categories
* Featured Products Section
* Product Search & Filtering
* Shopping Cart Management
* Secure Checkout Process
* Coupon & Discount
* Order Placement
* Responsive Design for Mobile & Desktop

### 💳 Payment Integration

* Stripe Payment Gateway
* Secure Payment Processing
* Order Confirmation Workflow

### 🛠️ Admin Features

* Admin Dashboard
* Product Management (CRUD)
* Category Management
* Coupon Management
* Order Monitoring
* User Management

## 📸 Screenshots

* Home Page
* Product Listing Page
* Product Details Page
* Cart Page
* Checkout Page
* Admin Dashboard

## 🏗️ Tech Stack

### Frontend

* React.js
* Redux Toolkit / Context API
* Tailwind CSS / CSS Modules
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT Authentication
* bcrypt

### Payments

* Stripe

## 📂 Project Structure

```bash
ShopEngine/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── .env
├── README.md
└── package.json
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/harshmunjal20/ShopEngine.git
cd ShopEngine
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CLIENT_URL=http://localhost:3000
```

### 4. Start the Application

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm start
```

## 🌐 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Cart

```http
GET    /api/cart
POST   /api/cart/add
DELETE /api/cart/remove/:id
```

### Orders

```http
POST /api/orders
GET  /api/orders/:id
```

### Coupons

```http
POST /api/coupons/apply
```

## 🔒 Security Features

* Password Hashing with bcrypt
* JWT-Based Authentication
* Protected Admin Routes
* Input Validation
* Secure Payment Processing

## 🎯 Future Enhancements

* Wishlist Functionality
* Product Reviews & Ratings
* Inventory Management
* Email Notifications
* AI-Based Product Recommendations
* Multi-Vendor Support

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

## 👨‍💻 Author

**Harsh Munjal**
