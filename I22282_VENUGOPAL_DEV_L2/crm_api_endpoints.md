# CRM System REST API Endpoints

## 1. Customer Management
- **GET /api/customers**  
  List all customers (with optional filters, pagination).
- **GET /api/customers/:id**  
  Get details for a specific customer.
- **POST /api/customers**  
  Create a new customer.
- **PUT /api/customers/:id**  
  Update an existing customer.
- **DELETE /api/customers/:id**  
  Delete a customer.

---

## 2. Contact History (Interactions)
- **GET /api/customers/:customerId/interactions**  
  List all interactions for a customer.
- **GET /api/interactions/:id**  
  Get details for a specific interaction.
- **POST /api/customers/:customerId/interactions**  
  Add a new interaction for a customer.
- **PUT /api/interactions/:id**  
  Update an interaction.
- **DELETE /api/interactions/:id**  
  Delete an interaction.

---

## 3. Sales Pipeline Stages (Leads/Opportunities)
- **GET /api/leads**  
  List all leads/opportunities (with filters, e.g., by stage).
- **GET /api/leads/:id**  
  Get details for a specific lead.
- **POST /api/leads**  
  Create a new lead.
- **PUT /api/leads/:id**  
  Update a lead (e.g., move to next pipeline stage).
- **DELETE /api/leads/:id**  
  Delete a lead.

---

## 4. Tasks
- **GET /api/tasks**  
  List all tasks (with filters, e.g., by user, status, due date).
- **GET /api/tasks/:id**  
  Get details for a specific task.
- **POST /api/tasks**  
  Create a new task.
- **PUT /api/tasks/:id**  
  Update a task.
- **DELETE /api/tasks/:id**  
  Delete a task.

---

## 5. Reports
- **GET /api/reports/sales**  
  Get sales pipeline summary/report (e.g., by stage, by user, by period).
- **GET /api/reports/activities**  
  Get activity report (e.g., number of interactions, tasks completed).
- **GET /api/reports/customers**  
  Get customer growth/retention report.

---

## 6. Authentication & Users
- **POST /api/auth/login**  
  User login.
- **POST /api/auth/register**  
  User registration.
- **POST /api/auth/logout**  
  User logout.
- **GET /api/users/me**  
  Get current user profile.
- **GET /api/users**  
  List all users (admin only).

---

**Notes:**
- All endpoints use standard REST conventions.
- Endpoints are grouped by resource (customers, interactions, leads, tasks, reports).
- Nested routes (e.g., `/customers/:customerId/interactions`) clarify relationships.
- Reports endpoints are read-only and return aggregated data.
- Authentication endpoints manage user sessions and profiles. 