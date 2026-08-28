# 📚 Library Management System (Full-Stack SQL + RBAC)

A comprehensive, production-ready **Library Management System** built with **React.js**, **Redux Toolkit**, **Node.js (Express)**, **MySQL**, and **Multer**. 

The system provides strict **Role-Based Access Control (RBAC)** across three distinct user roles (Member, Librarian, Admin), handles atomic database transactions for borrowing workflows, features image uploads for book covers, and provides automated fine calculations with dynamic slip generation.

---

## 🌟 Key Features

### 👤 Role-Based Access Control (RBAC)
* **Member (Student / Reader):**
  * Search and filter book catalog by title, author, or category.
  * View current active loans, due dates, and unpaid fine breakdown.
  * Calculate estimated late charges via an interactive Fine Calculator.
* **Librarian:**
  * Manage book inventory (Add, Edit, Delete books).
  * Upload book cover images using **Multer**.
  * Process book issues and returns.
  * Auto-calculate overdue fines and mark fine payments.
  * Generate printable transaction slips with dynamic QR code verification.
* **Admin:**
  * Manage all system users and assign roles (`MEMBER`, `LIBRARIAN`, `ADMIN`).
  * Access comprehensive analytics (Total Fine Revenue, Most Borrowed Books, Active Loans).

### 🛠️ Technical Highlights
* **Atomic SQL Transactions:** Prevents race conditions during simultaneous book issue/return requests using MySQL transactions (`START TRANSACTION`, `COMMIT`, `ROLLBACK`).
* **Multer File Storage:** Disk-storage pipeline with MIME-type file filtering and file size limits for book cover images.
* **Redux Toolkit Global State:** Managed global authentication state, role-gated routes, dynamic cart/issue workflows, and catalog state.
* **JWT Authentication:** Secure token-based authorization with custom role verification middleware.

---

## 🏗️ Tech Stack

* **Frontend:** React.js, Redux Toolkit (RTK), Axios, React Router v6, Tailwind CSS / Bootstrap.
* **Backend:** Node.js, Express.js.
* **Database:** MySQL (`mysql2` with Connection Pooling).
* **Middleware & Tools:** Multer (File Uploads), JSON Web Tokens (JWT), BcryptJS (Password Hashing).

---

## 📂 Project Architecture

```text
library-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                # MySQL Connection Pool
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT & RBAC Verification
│   │   └── uploadMiddleware.js  # Multer Configuration for Book Covers
│   ├── controllers/
│   │   ├── authController.js    # Login & Registration
│   │   ├── bookController.js    # Catalog & Multer Upload Logic
│   │   ├── issueController.js   # SQL Transaction Issue/Return Logic
│   │   └── adminController.js   # Role Management & Analytics
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── issueRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/
│   │   └── covers/              # Stored Cover Images
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/          # Shared Components & Protected Routes
    │   ├── pages/               # Landing, Member, Librarian & Admin Dashboards
    │   ├── redux/
    │   │   ├── store.js         # Redux Toolkit Store Config
    │   │   └── slices/          # Auth, Book Catalog, & Issue Slices
    │   └── services/            # Axios Setup with Interceptors
    └── App.js
