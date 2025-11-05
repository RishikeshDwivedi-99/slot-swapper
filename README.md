# Slot-Swapper MERN Project

A full-stack MERN (MongoDB, Express, React, Node.js) application built for swapping or managing slots. This project features user authentication, event management, and slot swapping functionality.

---

## ✨ Features

* **User Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
* **Event Management:** Create, view, update, and delete events.
* **Slot Swapping:** Functionality for users to swap or manage their assigned slots.

---

## 🛠️ Tech Stack

* **MongoDB:** NoSQL database.
* **Express.js:** Backend framework for the RESTful API.
* **React:** Frontend library (using Vite).
* **Node.js:** JavaScript runtime for the server.
* **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
* **JWT:** For user authentication.

---

## 📦 Getting Started (Local Setup)

Follow these instructions to get a copy of the project running on your local machine.

### Prerequisites

* **Node.js** (v16 or later)
* **MongoDB** (running locally or a cloud service like Atlas)
* **Git**

### 1. Clone the Repository

Clone the project to your local machine:
```bash
git clone [https://github.com/RishikeshDwivedi-59/slot-swapper.git](https://github.com/RishikeshDwivedi-59/slot-swapper.git)
cd slot-swapper
```

### 2. Backend Setup (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a file named **`.env`** in the `server` folder and add your configuration:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key_for_jwt
    CORS_ORIGIN=http://localhost:5173
    ```
    *(Note: The port for `CORS_ORIGIN` must match your local frontend's port.)*

4.  Run the backend server:
    ```bash
    npm start
    ```
    The server will start on **http://localhost:5000**.

### 2. Frontend Setup (Client)

1.  Open a **new terminal** window and navigate to the client directory (from the main project folder):
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a file named **`.env`** in the `client` folder and add the API URL:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Run the frontend development server:
    ```bash
    npm run dev
    ```
    The React app will open in your browser at **http://localhost:5173**.
