// Payment.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CREDIT_CARD');
  const [message, setMessage] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5050/api/payments',
        { bookingId, paymentMode, amount},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Payment successful!');
    } catch (error) {
      setMessage('Payment failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Make a Payment</h2>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          required
        />
        
        <select value={paymentMode} onChange={(e) => setMethod(e.target.value)}>
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="NET_BANKING">Net Banking</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Pay</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Payment;