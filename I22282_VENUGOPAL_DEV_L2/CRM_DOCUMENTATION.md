# CRM System Documentation

---

## 1. Architecture Diagram

The CRM system is designed as a full-stack application with the following components:

- **Frontend:** React (UI, state management, routing, authentication)
- **Backend:** Node.js/Express (API, business logic, authentication)
- **Database:** PostgreSQL (data storage, relational schema)
- **API Layer:** RESTful endpoints for all core resources
- **Authentication:** JWT/session-based, handled on both frontend and backend
- **Modular Structure:** Separation of concerns for scalability and maintainability

**Diagram:**

See [`crm_architecture.mmd`](./crm_architecture.mmd) for the full-stack architecture diagram (Mermaid format).

---

## 2. Database Schema

The CRM database is structured to support users, customers, leads, interactions, and tasks, with proper relationships and constraints.

**Schema File:** [`crm_schema.sql`](./crm_schema.sql)

**Key Tables:**
- `users`: Application users (with roles)
- `customers`: Customer records
- `leads`: Sales pipeline leads/opportunities
- `interactions`: Contact history (calls, emails, meetings)
- `tasks`: Tasks assigned to users/customers

**Highlights:**
- Primary and foreign keys for data integrity
- Unique constraints on emails and usernames
- Cascading deletes and nullification for user/customer relationships

---

## Project Timeline
- **Total Development Time:** 2 days

## Feature Roadmap & Time Estimates
| Phase                        | Estimated Time |
|------------------------------|---------------|
| Planning & Architecture      | 0.25 day      |
| Database & Backend Setup     | 0.5 day       |
| Frontend Setup & UI          | 0.5 day       |
| Integration & Testing        | 0.5 day       |
| Documentation & Deployment   | 0.25 day      |
| **Total**                    | **2 days**    |

---

**Notes:**
- All features were designed, implemented, and tested within a rapid 2-day development sprint. 