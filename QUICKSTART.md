# 🚀 Quick Start Guide - Event Planning Web Application

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Code editor (VS Code recommended)
- [ ] Two terminals ready

## Step-by-Step Setup (5 minutes)

### Step 1: Install Backend Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### Step 2: Install Frontend Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

### Step 3: Start MongoDB
**Option A - Local MongoDB:**
\`\`\`bash
net start MongoDB    # Windows
\`\`\`

**Option B - MongoDB Atlas:**
- Already configured in `.env` - Skip this step if using local

### Step 4: Seed Database
\`\`\`bash
cd backend
node seed.js
\`\`\`
✅ This creates admin user, sample events, and test data

### Step 5: Start Backend Server
\`\`\`bash
cd backend
npm start
\`\`\`
✅ Backend running on http://localhost:5000

### Step 6: Start Frontend (New Terminal)
\`\`\`bash
cd frontend
npm run dev
\`\`\`
✅ Frontend running on http://localhost:5173

### Step 7: Open Browser
Navigate to: **http://localhost:5173**

## Login Credentials

### Admin Access
- **Email:** admin@eventhub.com
- **Password:** admin123

### Regular User
- **Email:** user@eventhub.com
- **Password:** user123

## What to Test

### As Admin:
1. Login with admin credentials
2. Go to Admin Dashboard
3. View statistics
4. Go to "Manage Events"
5. Create a new event
6. Edit an existing event
7. Delete an event

### As User:
1. Signup for a new account OR login as user
2. Browse events on homepage
3. Click "Events" to see all events
4. Use search and filter features
5. Click on an event to view details
6. See Google Maps location
7. Click "Register for Event"
8. Go to "My Dashboard"
9. View registered events
10. Update profile
11. Cancel a registration

## File Structure
\`\`\`
event-planning-app/
├── backend/          # Node.js/Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & upload
│   └── uploads/      # Event images
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   └── utils/       # API utilities
│   └── public/
│
└── README.md         # Full documentation
\`\`\`

## Troubleshooting

### "MongoDB connection failed"
- Ensure MongoDB is running: `net start MongoDB`
- Or update MONGO_URI in `backend/.env` with Atlas connection string

### "Port 5000 already in use"
- Change PORT in `backend/.env` to 5001
- Update VITE_API_URL in `frontend/.env` to match

### "Cannot find module"
- Run `npm install` in both backend and frontend directories

### Images not showing
- Run: `node seed.js` to populate database with sample data
- Check that `backend/uploads/` folder contains images

## Environment Files

Backend `.env`:
\`\`\`
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-planning
JWT_SECRET=event_planning_secret_key_2024_university_project
NODE_ENV=development
\`\`\`

Frontend `.env`:
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8
\`\`\`

## Features Overview

### ✅ User Features
- Browse and search events
- Filter by category and date
- View event details with Google Maps
- Register/RSVP for events
- User dashboard with registrations
- Profile management

### ✅ Admin Features
- Admin dashboard with statistics
- Create, edit, delete events
- Upload event images
- View all registrations
- Manage event locations

### ✅ Technical Features
- JWT authentication
- Role-based access control
- Responsive design (mobile, tablet, desktop)
- Google Maps integration
- Image upload
- Search and filter
- Modern UI with Tailwind CSS

## Support

For detailed documentation, see: [README.md](file:///c:/Users/HP/Desktop/New%20folder%20%285%29/README.md)

---

**Ready to start? Follow the steps above! 🚀**
