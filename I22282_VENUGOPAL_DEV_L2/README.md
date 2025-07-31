# CRM System

A full-stack Customer Relationship Management (CRM) application with a React frontend and Node.js/Express backend, using PostgreSQL for data storage.

---

## Features

### Customer Management
- Add, edit, view, and search customer profiles
- View contact history (interactions) per customer

### Contact History
- Log and view interactions (calls, emails, meetings, notes) for each customer

### Sales Pipeline
- Manage leads through stages: Lead → Qualified → Proposal → Closed
- Advance leads through pipeline with business rules

### Task Management
- Add, assign, and view tasks (follow-ups, reminders)
- Set due dates for tasks
- In-app reminders for tasks due soon
- Automated backend job for reminders

### Authentication & Users
- User registration and login (JWT-based, can be enabled/disabled)
- Role support (admin/user) in backend logic

---

## Project Structure

```
myapp/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Express controllers (business logic)
│   │   ├── models/           # Sequelize models (DB tables)
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Service layer for DB access
│   │   ├── jobs/             # Background jobs (e.g., reminders)
│   │   ├── utils/            # Logger, helpers
│   │   ├── config/           # DB connection
│   │   ├── app.js            # Express app setup
│   │   ├── server.js         # Server entry point
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── pages/            # Main app pages (Customers, Leads, Tasks, Interactions)
│   │   ├── components/       # Reusable UI components (Sidebar, forms)
│   │   ├── api/              # Axios instance
│   │   ├── App.js, index.js  # App entry and routing
│   ├── package.json
│   └── ...
└── ...
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL

### Backend Setup
1. `cd backend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your `.env` file:
   ```env
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_HOST=localhost
   PORT=3001
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```
4. Run database migrations/seed (if needed):
   ```sh
   node src/seed.js
   ```
5. Start the backend server:
   ```sh
   node src/server.js
   ```

### Frontend Setup
1. `cd frontend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```
4. The app will run at [http://localhost:3000](http://localhost:3000)

---

## Usage
- **Customers:** Add, edit, view, and search customers. Click "View Interactions" to see contact history.
- **Leads:** Add leads, filter/search, and move leads through pipeline stages.
- **Tasks:** Add tasks with due dates, assign to users/customers, and get reminders for upcoming tasks.
- **Interactions:** Log and view all communications with customers.

---

## Tech Stack
- **Frontend:** React, Material UI, Axios, Recharts
- **Backend:** Node.js, Express, Sequelize, PostgreSQL, node-cron
- **Other:** Winston (logging), express-validator (validation), JWT (auth, optional)

---

## Customization & Extensibility
- Enable/disable authentication and roles as needed
- Add more fields or modules (e.g., products, invoices)
- Integrate with email/SMS APIs for real notifications
- Add more analytics or dashboard widgets

---

## License
MIT 