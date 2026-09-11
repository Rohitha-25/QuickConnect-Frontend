## 👨‍🔧 QuickConnect – Frontend

### Overview
QuickConnect is a service-booking platform that connects users with service providers. This repository contains the React frontend for browsing services, booking appointments, viewing booking history, managing profile information and interacting with the backend APIs.

The UI is built as a Vite-powered React single-page application and communicates with the Spring Boot backend using Axios.

### Features
- User registration and login
- Service browsing
- Service-provider interaction
- Booking workflow
- Booking confirmation and history
- Profile management
- Payment interface
- Review and rating interface
- Provider verification flow
- API integration with JWT authentication
- Responsive user interface
- AI assistant interface

### End User Flow
```
Login / Register
      ↓
Browse Services
      ↓
Select Service
      ↓
Confirm Slot
      ↓
Booking Confirmation
      ↓
Payment
      ↓
Review / Rating
```

### Frontend Architecture
```
React UI
   ↓
React Router
   ↓
Components / Pages
   ↓
Axios API Client
   ↓
Spring Boot Backend
   ↓
MySQL
```

### Application Components
- Home
- Login / Registration
- AI assistant
- Services
- Booking and slot confirmation
- Booking history
- Booking confirmation
- Payments
- Reviews
- Profile
- Provider verification
- OTP flow
- Logout

### Tech Stack
- React.js
- Axios
- CSS

### Local Setup

#### Prerequisites
```
Node.js 18+
npm
```

#### 1. Clone
```
git clone https://github.com/Rohitha-25/QuickConnect-Frontend.git
cd QuickConnect-Frontend
```

#### 2. Install dependencies
```
npm install
```

#### 3. Run
```
npm run dev
```
#### Related Repository
https://github.com/Rohitha-25/QuickConnect-Backend
