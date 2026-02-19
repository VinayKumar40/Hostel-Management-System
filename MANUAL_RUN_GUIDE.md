# Hostel Management System – Final Setup Guide

This guide ensures the project runs perfectly without any errors and provides the credentials for administrative access.

---

## 🔐 Administrative Credentials

| Name | Role | User ID | Password |
|------|------|---------|----------|
| **Vinay Kumar** | Admin + Warden | `12303566` | `VINAY0802` |
| **Adel Muhammed** | Area Warden | `WARDEN002` | `ADEL002` |

---

## 🛠️ Step-by-Step Setup (Run without Errors)

Follow these steps in order to ensure the environment is correctly configured.

### 1. Prerequisites
- **Node.js**: [Download here](https://nodejs.org/)
- **MongoDB**: Ensure MongoDB Community Server is installed and running on `localhost:27017`.

### 2. Environment Configuration
Navigate to the `server` folder and check the `.env` file. It should look like this:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hostel_db
JWT_SECRET=CampusNest_Secret_2024
```

### 3. Install Dependencies & Seed Data
Run these commands in two separate terminal windows (VS Code terminal is recommended).

**Terminal 1 (Backend):**
```bash
cd server
npm install
node seeder.js         # Creates Admin & Rooms
node seedParticipants.js # Creates Wardens & Students
npm run dev            # Starts Backend on Port 5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev            # Starts Frontend on Port 5173
```

### 4. Direct Access
Once both servers are running, open your browser and go to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ✅ Final Verification
- **Login**: Use the IDs provided above.
- **RMS (Relationship Management System)**: Available via the "Service Desk" in the sidebar.
- **Mess Management**: Wardens can enroll/unenroll students.
- **People Management**: Wardens/Admins can manage the full student list.

*Project Finalized on: Feb 20, 2026*
