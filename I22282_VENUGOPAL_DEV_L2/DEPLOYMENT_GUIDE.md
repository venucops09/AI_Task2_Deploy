# CRM System Deployment Guide

---

## 1. Overview
- **Frontend:** React app hosted on Vercel
- **Backend:** Node.js/Express API hosted on AWS (EC2/Elastic Beanstalk), GCP (App Engine/Cloud Run), or Render
- **Database:** PostgreSQL (managed service or cloud VM)

---

## 2. Database Setup (PostgreSQL)

### **Option A: Managed Cloud Database**
- Use AWS RDS, GCP Cloud SQL, or Render PostgreSQL.
- Create a new PostgreSQL instance.
- Note the host, port, database name, username, and password.
- Allow connections from your backend server's IP or VPC.

### **Option B: Self-Hosted/Postgres on VM**
- Install PostgreSQL on your VM.
- Create a database and user for your app.
- Open the port (default 5432) for your backend server.

---

## 3. Backend Deployment (AWS/GCP/Render)

### **A. Prepare Your Backend**
- Ensure your backend has a `package.json` with start script: `node src/server.js`.
- Add a `.env` file (see below) or set environment variables in your cloud provider's dashboard.

### **B. Environment Variables**
Set these in your cloud provider's dashboard or as a `.env` file:
```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=your_db_host
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### **C. Deploy to Render (example)**
1. Push your backend code to GitHub.
2. Go to [Render.com](https://render.com/), create a new Web Service, and connect your repo.
3. Set the build and start commands:
   - Build: `npm install`
   - Start: `node src/server.js`
4. Add environment variables in the Render dashboard.
5. Deploy and note the backend URL (e.g., `https://your-backend.onrender.com`).

### **D. Deploy to AWS (EC2/Elastic Beanstalk)**
- For EC2: SSH, clone repo, set up Node.js, run with PM2 or as a service.
- For Elastic Beanstalk: Zip and upload your code, set env vars in the EB dashboard.

### **E. Deploy to GCP (App Engine/Cloud Run)**
- For App Engine: Add `app.yaml`, deploy with `gcloud app deploy`.
- For Cloud Run: Build a Docker image, deploy with `gcloud run deploy`.

---

## 4. Frontend Deployment (Vercel)

### **A. Prepare Your Frontend**
- Ensure your frontend is a React app with a `package.json` and build script.
- In your frontend, set the API base URL to your deployed backend (e.g., in `src/api/axios.js`):
  ```js
  const api = axios.create({
    baseURL: 'https://your-backend.onrender.com/api',
    // ...
  });
  ```

### **B. Deploy to Vercel**
1. Push your frontend code to GitHub.
2. Go to [Vercel.com](https://vercel.com/), import your repo.
3. Set the build command: `npm run build` (default for Create React App).
4. Set environment variables if needed (e.g., `REACT_APP_API_URL`).
5. Deploy. Your app will be live at `https://your-app.vercel.app`.

---

## 5. Environment Variables Summary
| Variable             | Backend         | Frontend (if needed) |
|----------------------|----------------|---------------------|
| DB_NAME              | Yes            | No                  |
| DB_USER              | Yes            | No                  |
| DB_PASS              | Yes            | No                  |
| DB_HOST              | Yes            | No                  |
| PORT                 | Yes            | No                  |
| JWT_SECRET           | Yes            | No                  |
| JWT_REFRESH_SECRET   | Yes            | No                  |
| REACT_APP_API_URL    | No             | Yes (optional)      |

---

## 6. Final Steps
- Test your backend API endpoint from the frontend (update the base URL if needed).
- Ensure CORS is enabled on the backend for your frontend domain.
- Secure your environment variables and secrets.
- Set up HTTPS for both frontend and backend.

---

**For more details, see the documentation for [Vercel](https://vercel.com/docs), [Render](https://render.com/docs), [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/), or [GCP App Engine](https://cloud.google.com/appengine/docs).** 