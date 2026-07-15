import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Login            from './components/Login';
import Register         from './components/Register';
import Home             from './components/Home';
import Services         from './components/Services';
import Booking          from './components/Booking';
import ConfirmSlot      from './components/ConfirmSlot';
import Payment          from './components/Payment';
import BookingConfirmed from './components/BookingConfirmed';
import Review           from './components/Review';
import Logout           from './components/Logout';

function Protected({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/components/Login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/"                         element={<Navigate to="/components/Login" replace />} />
      <Route path="/components/Login"         element={<Login />} />
      <Route path="/components/Register"      element={<Register />} />
      <Route path="/components/Logout"        element={<Logout />} />

      <Route path="/components/Home"               element={<Protected><Home /></Protected>} />
      <Route path="/components/Services"           element={<Protected><Services /></Protected>} />
      <Route path="/components/Booking"            element={<Protected><Booking /></Protected>} />
      <Route path="/components/ConfirmSlot"       element={<Protected><ConfirmSlot /></Protected>} />
      <Route path="/components/Payment"            element={<Protected><Payment /></Protected>} />
      <Route path="/components/BookingConfirmed"  element={<Protected><BookingConfirmed /></Protected>} />
      <Route path="/components/Review"             element={<Protected><Review /></Protected>} />
    </Routes>
  );
}

export default App;
