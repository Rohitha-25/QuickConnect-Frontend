// Review.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Review = () => {
  const [serviceId, setServiceId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5050/api/reviews',
        {
          serviceId,
          rating,
          comment,
          date: new Date().toISOString().split('T')[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Review submitted successfully!');
    } catch (error) {
      setMessage('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Submit a Review</h2>
      <form onSubmit={handleReviewSubmit}>
        <input
          type="text"
          placeholder="Service ID"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
        <textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit Review</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Review;