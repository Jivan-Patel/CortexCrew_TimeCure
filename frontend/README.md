# TimeCure Frontend - React + Vite

## Features

✅ **User Authentication**
- Sign Up with role selection (Doctor/Patient)
- Email verification with OTP
- Secure Login
- Role-based Dashboard
- Logout functionality

✅ **Role Selection**
- Beautiful UI with Doctor/Patient role options
- Visual indicator for selected role
- Fully responsive design

✅ **Dashboard**
- Different dashboards for Doctors and Patients
- Quick action cards
- User profile display
- Responsive layout

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── auth.js           # API calls to backend auth endpoints
│   ├── components/
│   │   ├── RoleSelector.jsx  # Role selection component
│   │   └── RoleSelector.css
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Signup page with email verification
│   │   ├── Dashboard.jsx     # Dashboard (doctor/patient)
│   │   ├── Auth.css          # Login/Signup styles
│   │   └── Dashboard.css     # Dashboard styles
│   ├── App.jsx               # Main app component with routing
│   ├── App.css
│   ├── main.jsx              # Entry point
│ and package.json
├── vite.config.js            # Vite configuration
├── index.html                # HTML entry point
└── .gitignore
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Backend URL
Update the `API_BASE_URL` in [src/api/auth.js](src/api/auth.js) if your backend is running on a different port:
```javascript
const API_BASE_URL = 'http://localhost:5000/api/auth';
```

### 3. Start Development Server
```bash
npm run dev
```
The app will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## Backend Requirements

Make sure your backend is running with these endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/get-me` - Get current user info
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/verify-email` - Verify email with OTP

## API Integration

### Register
```javascript
POST /api/auth/register
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "doctor" // or "patient"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Verify Email
```javascript
GET /api/auth/verify-email?email=john@example.com&otp=123456
```

## Features Implemented

### Authentication
- ✅ User registration with role selection
- ✅ Email verification with OTP
- ✅ Secure login with JWT tokens
- ✅ Token storage in localStorage
- ✅ Automatic token injection in requests

### Roles
- ✅ Doctor role
- ✅ Patient role
- ✅ Role-based dashboard UI

### UI/UX
- ✅ Beautiful gradient design
- ✅ Role selector with visual options
- ✅ Responsive design for mobile/tablet
- ✅ Error handling and messages
- ✅ Loading states
- ✅ Smooth animations

## Next Steps (To be integrated)

- [ ] Doctor profile setup
- [ ] Patient medical history
- [ ] Appointment booking
- [ ] Doctor search
- [ ] Real-time notifications
- [ ] Video consultation
- [ ] Prescription management

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure your backend has CORS enabled:
```javascript
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Token Issues
- Clear localStorage if you have old tokens
- Make sure backend returns token in response
- Check token format (should be JWT)

### Backend Connection
- Verify backend is running on `http://localhost:5000`
- Check network tab in DevTools for API calls
- Make sure endpoints exist and are correct

## Technologies Used

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations
