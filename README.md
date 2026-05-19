# AI-Based Smart Complaint Management System

A full-stack MERN application that allows users to register complaints online, featuring AI-powered complaint priority classification, automated responses, and department recommendations using the Google Gemini API.

## Features

- **User Authentication:** Secure JWT-based Login and Signup.
- **Complaint Registration:** Submit detailed complaints with location and category.
- **AI Analysis:** Automatically detect priority, suggest departments, and generate a summary and auto-response message based on the complaint description.
- **Dashboard:** Track and manage all complaints.
- **Filters & Search:** Search by location and filter by category.
- **Status Updates:** Update complaint status (Pending, In Progress, Resolved).

## Tech Stack

- **Frontend:** React.js, Vite, TailwindCSS v4, React Router, Axios, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integration:** Google Gemini API (`@google/genai`)

## Local Setup

### 1. Database Setup
Make sure you have a local instance of MongoDB running on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `backend/.env`.

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000*

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Deployment on Render

### Backend Deployment
1. Create a **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: A secure random string
   - `GEMINI_API_KEY`: Your Google Gemini API Key

### Frontend Deployment
1. Create a **Static Site** on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `frontend`.
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend-url.onrender.com/api`)

## PDF Report Generation

To generate the final PDF report for your exam:
1. Copy the source code files.
2. Take screenshots of the UI (Login, Dashboard, Create Complaint with AI Analysis).
3. Use Postman or Thunder Client to test the endpoints (`/api/auth/signup`, `/api/complaints`, etc.) and screenshot the responses.
4. Take a screenshot of your MongoDB Atlas cluster showing the `users` and `complaints` collections with stored data.
5. Once deployed on Render, take screenshots of the successful deployment logs and include the Live URLs.
6. Compile all this into a single PDF document.
