# MobileMechanicShop

A full-stack, secure automotive repair management web application designed to streamline appointment tracking, vehicle history logs, and customer management.

## 🚀 Key Features & Security Architecture

* **Secure Authentication & Authorization:** Implemented credential-based login using **bcrypt** for salted password hashing alongside **Google OAuth 2.0** integration.
* **HTTP-Only Cookie Sessions:** Replaced vulnerable `localStorage` token storage with server-signed JSON Web Tokens (JWT) transmitted via secure, `httpOnly`, `sameSite: 'strict'` cookies to prevent XSS and token hijacking.
* **Protected Middleware:** Custom Express middleware verifying cookie-based sessions to guard protected API endpoints.
* **Relational Database Integrity:** Built with **MySQL** (`mysql2`), utilizing parameterized queries to prevent SQL injection and strict multi-step database transactions (`beginTransaction`, `commit`, `rollback`) during account registration.
* **Dynamic Search & UI:** Real-time client-side search filtering and responsive dashboard components built with **React** and **Node.js/Express**.
* **Production Deployment:** Configured with **PM2** for process management and automated deployment workflows.

## 🛠️ Tech Stack

* **Frontend:** React, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JWT, Google Auth Library, bcryptjs


Things learned - 
