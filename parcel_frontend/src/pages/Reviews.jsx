import { useState, useEffect } from 'react';
import { reviewAPI, parcelAPI } from '../services/api';
import '../styles/Reviews.scss';

function Reviews() {
  const [parcels, setParcels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    comment: '',
    rating: 5,
    delivery_speed_rating: 5,
    packaging_quality_rating: 5,
    communication_rating: 5,
    would_recommend: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParcels();
    fetchReviews();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await parcelAPI.list({ status: 'delivered' });
      setParcels(response.data.results);
    } catch (err) {
      console.error('Failed to fetch parcels');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.list();
      setReviews(response.data.results);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParcelId) {
      alert('Please select a parcel');
      return;
    }

    try {
      setLoading(true);
      await reviewAPI.create({
        ...formData,
        parcel: selectedParcelId,
        rating: parseInt(formData.rating),
        delivery_speed_rating: parseInt(formData.delivery_speed_rating),
        packaging_quality_rating: parseInt(formData.packaging_quality_rating),
        communication_rating: parseInt(formData.communication_rating),
      });
      setFormData({
        title: '',
        comment: '',
        rating: 5,
        delivery_speed_rating: 5,
        packaging_quality_rating: 5,
        communication_rating: 5,
        would_recommend: true,
      });
      setSelectedParcelId('');
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviews">
      <h1>⭐ Delivery Reviews</h1>

      <div className="review-form-section">
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Select Delivered Parcel *</label>
            <select
              value={selectedParcelId}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              required
            >
              <option value="">-- Select a parcel --</option>
              {parcels.map(parcel => (
                <option key={parcel.id} value={parcel.id}>
                  {parcel.tracking_number} - {parcel.receiver_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="rating-group">
            <div className="form-group">
              <label>Overall Rating *</label>
              <select name="rating" value={formData.rating} onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Delivery Speed</label>
              <select name="delivery_speed_rating" value={formData.delivery_speed_rating} onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Packaging Quality</label>
              <select name="packaging_quality_rating" value={formData.packaging_quality_rating} onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Communication</label>
              <select name="communication_rating" value={formData.communication_rating} onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="would_recommend"
              checked={formData.would_recommend}
              onChange={handleChange}
            />
            <label>I would recommend this service</label>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="reviews-list-section">
        <h2>Recent Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3>{review.title}</h3>
                  <span className="rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="reviewer">By: {review.reviewer_username}</p>
                <p className="comment">{review.comment}</p>
                <div className="review-meta">
                  <span>Parcel: {review.parcel_tracking}</span>
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
