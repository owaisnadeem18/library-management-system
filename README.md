# 📚 Enterprise Library Management System (Monorepo)

A production-grade, full-stack **Library Management System** built with **Node.js (ES Modules)**, **Express.js**, **MySQL**, **Multer**, **React.js**, and **Redux Toolkit**.

This system uses a **Monorepo Architecture** (`/backend` and `/frontend`), adhering to strict **Object-Oriented Programming (OOP)**, the **Controller-Service Layer Pattern**, **Role-Based Access Control (RBAC)**, atomic MySQL transactions, dynamic late-fine calculations, and centralized error handling.

---

## 🏗️ Architecture & Core Features

* **Layered OOP Architecture:** Separation of concerns between Data Access (`Services`), Business/Request Logic (`Controllers`), and API routing.
* **Monorepo Management:** Single Git repository hosting decoupled `/backend` and `/frontend` environments.
* **Atomic SQL Transactions:** Guarantees data consistency during concurrent issue and return requests using MySQL `START TRANSACTION`, `COMMIT`, and `ROLLBACK`.
* **Multer File Pipeline:** Disk storage engine with dynamic directory initialization, MIME type filtering, and image upload limits for book covers.
* **Centralized Async Error Handling:** Custom `AppError` class extending native JavaScript `Error` with a global Express error handling middleware pipeline.
* **Frontend State Management:** Integrated Redux Toolkit (RTK) slices for global auth context, catalog caching, dynamic carts, and API interceptors.

---

## 📂 Project Directory Structure

```text
library-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL Connection Pool (mysql2/promise)
│   ├── utils/
│   │   ├── appError.js           # Custom AppError Class (Inheritance)
│   │   └── catchAsync.js         # Asynchronous Exception Handler Wrapper
│   ├── middleware/
│   │   ├── errorMiddleware.js    # Centralized Operational Error Middleware
│   │   ├── authMiddleware.js     # JWT & RBAC Restriction Middleware
│   │   └── uploadMiddleware.js   # Multer Storage Engine & Disk Config
│   ├── services/                 # OOP Business Logic & SQL Encapsulation
│   │   ├── userService.js        # Auth & Account Database Operations
│   │   ├── bookService.js        # Catalog & Multer File Persistence Logic
│   │   ├── issueService.js       # Atomic SQL Transactions (Borrow/Return)
│   │   └── adminService.js       # Role Promotions & System Analytics
│   ├── controllers/              # HTTP Route Request Handlers
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── issueController.js
│   │   └── adminController.js
│   ├── routes/                   # Express API Route Groups
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── issueRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/
│   │   └── covers/               # Uploaded Book Cover Media Files
│   ├── .env
│   ├── package.json              # Backend Dependencies ("type": "module")
│   └── server.js                 # Express Application Entry Point
│
└── frontend/
    ├── src/
    │   ├── components/           # Shared UI, Modals & Protected Routes
    │   ├── pages/                # Member, Librarian, & Admin Dashboards
    │   ├── redux/
    │   │   ├── store.js          # Redux Toolkit Global Store Config
    │   │   └── slices/           # Auth, Book Catalog, & Issue Cart Slices
    │   └── services/             # Axios Setup with Auth Interceptors
    └── package.json
```
