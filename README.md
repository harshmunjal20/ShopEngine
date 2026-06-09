# 🛒 ShopEngine

A modern full-stack e-commerce platform built to provide a seamless online shopping experience. ShopEngine includes product categorization, secure payments, coupon management, cart functionality, an admin dashboard, and a responsive user interface.

## 🌐 Live Demo

Experience ShopEngine live:

🔗 **Website:** [Visit ShopEngine](https://shopengine-harsh.onrender.com/)

## Features

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
  <img width="1890" height="887" alt="Screenshot 2026-06-09 194722" src="https://github.com/user-attachments/assets/7a466156-5af8-4671-8cb2-5f2d1707e581" />

* Product Listing Page
  <img width="1903" height="912" alt="Screenshot 2026-06-09 194742" src="https://github.com/user-attachments/assets/a2039c1c-b5d1-4127-a5a4-a3603e5276be" />

* Cart Page
  <img width="1887" height="886" alt="Screenshot 2026-06-09 194758" src="https://github.com/user-attachments/assets/d9e464ff-4c52-416f-b1e9-29a6a387183c" />

* Checkout Page
  <img width="1918" height="892" alt="Screenshot 2026-06-09 194859" src="https://github.com/user-attachments/assets/dee9ebaf-3d39-463f-a676-ef9f19f280e6" />

* Admin Dashboard
  <img width="1861" height="884" alt="Screenshot 2026-06-09 194930" src="https://github.com/user-attachments/assets/2c21a5cb-a674-4978-b934-d126e947062b" />


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
