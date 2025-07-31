# CRM Frontend Documentation

---

## 1. Component Structure

```
src/
├── api/
│   └── axios.js                # Axios instance for API calls
├── components/
│   ├── Sidebar.js              # Responsive sidebar navigation
│   └── CustomerForm.js         # Form for add/edit customer
├── pages/
│   ├── Home.js                 # Dashboard/home page
│   ├── Customers.js            # Customers list, add/edit
│   ├── Leads.js                # Leads list, add
│   ├── Tasks.js                # Tasks page (placeholder)
│   ├── Interactions.js         # Interactions page (placeholder)
├── Layout.js                   # Main layout with AppBar and Sidebar
├── App.js                      # Routing and layout
├── index.js                    # App entry point
├── store.js                    # Redux store (if used)
```

---

## 2. Routing Hierarchy

- All routes are wrapped in the `Layout` component, which provides the AppBar and Sidebar.
- Routing is handled with `react-router-dom` in `App.js`:

```
<Layout>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/leads" element={<Leads />} />
    <Route path="/tasks" element={<Tasks />} />
    <Route path="/interactions" element={<Interactions />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Layout>
```

- The sidebar navigation links to all major features: Dashboard, Customers, Leads, Tasks, Reports, Settings.

---

## 3. API Integration Logic

- **API Utility:**
  - `src/api/axios.js` exports a pre-configured Axios instance with the base URL and JWT token support via interceptors.

- **Data Fetching:**
  - Each page (e.g., `Customers.js`, `Leads.js`) uses `useEffect` to fetch data from the backend API on mount.
  - Example (Customers):
    ```js
    useEffect(() => {
      fetchCustomers();
    }, []);
    ```
  - The `fetchCustomers` function uses Axios to call `/customers` and updates local state.

- **Data Updating:**
  - Forms (e.g., `CustomerForm`) are used for add/edit operations.
  - On submit, Axios is used to POST or PUT data to the backend.
  - After a successful operation, the list is refreshed.

- **Loading & Error States:**
  - Each page manages its own loading and error state, showing a spinner or error message as needed.

- **Authentication:**
  - JWT tokens are stored in `localStorage` and automatically attached to API requests via the Axios interceptor.

---

**To extend:**
- Add more feature pages in `pages/` and connect them to the API using the same pattern.
- Use Redux or Context API for global state if needed (e.g., for user authentication, notifications). 