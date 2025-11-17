import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { parcelAPI } from '../services/api';
import '../styles/ParcelDetail.scss';

function ParcelDetail() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParcel();
  }, [id]);

  const fetchParcel = async () => {
    try {
      const response = await parcelAPI.detail(id);
      setParcel(response.data);
    } catch (err) {
      setError('Failed to fetch parcel details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!parcel) return <div className="error">Parcel not found</div>;

  return (
    <div className="parcel-detail">
      <h1>Parcel Details</h1>
      <div className="detail-container">
        <div className="detail-section">
          <h2>{parcel.tracking_number}</h2>
          <p><strong>Status:</strong> {parcel.status_display}</p>
          <p><strong>Type:</strong> {parcel.type_display}</p>
        </div>

        <div className="detail-section">
          <h3>Sender Information</h3>
          <p><strong>Name:</strong> {parcel.sender_name}</p>
          <p><strong>Email:</strong> {parcel.sender_email || 'N/A'}</p>
          <p><strong>Phone:</strong> {parcel.sender_phone || 'N/A'}</p>
        </div>

        <div className="detail-section">
          <h3>Receiver Information</h3>
          <p><strong>Name:</strong> {parcel.receiver_name}</p>
          <p><strong>Email:</strong> {parcel.receiver_email || 'N/A'}</p>
          <p><strong>Phone:</strong> {parcel.receiver_phone || 'N/A'}</p>
          <p><strong>Address:</strong> {parcel.receiver_address || 'N/A'}</p>
        </div>

        <div className="detail-section">
          <h3>Parcel Information</h3>
          <p><strong>Weight:</strong> {parcel.weight ? `${parcel.weight} kg` : 'N/A'}</p>
          <p><strong>Value:</strong> {parcel.value ? `$${parcel.value}` : 'N/A'}</p>
          <p><strong>Description:</strong> {parcel.description || 'N/A'}</p>
          <p><strong>Current Location:</strong> {parcel.current_location || 'N/A'}</p>
        </div>

        {parcel.status_history && parcel.status_history.length > 0 && (
          <div className="detail-section">
            <h3>Status History</h3>
            <div className="history-list">
              {parcel.status_history.map((history, idx) => (
                <div key={idx} className="history-item">
                  <p>{history.previous_status} → {history.new_status}</p>
                  <small>{new Date(history.created_at).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParcelDetail;
