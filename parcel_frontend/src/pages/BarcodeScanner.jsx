import { useState } from 'react';
import { parcelAPI } from '../services/api';
import '../styles/BarcodeScanner.scss';

function BarcodeScanner() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      const response = await parcelAPI.searchByBarcode(trackingNumber);
      setParcel(response.data);
      setError(null);
    } catch (err) {
      setError('Parcel not found');
      setParcel(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="barcode-scanner">
      <h1>📱 Barcode Scanner</h1>
      
      <form onSubmit={handleSearch} className="scanner-form">
        <input
          type="text"
          placeholder="Enter tracking number or scan barcode..."
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="scanner-input"
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {parcel && (
        <div className="parcel-result">
          <h2>{parcel.tracking_number}</h2>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">Status:</span>
              <span className={`value status ${parcel.status}`}>{parcel.status_display}</span>
            </div>
            <div className="result-item">
              <span className="label">Type:</span>
              <span className="value">{parcel.type_display}</span>
            </div>
            <div className="result-item">
              <span className="label">From:</span>
              <span className="value">{parcel.sender_name}</span>
            </div>
            <div className="result-item">
              <span className="label">To:</span>
              <span className="value">{parcel.receiver_name}</span>
            </div>
            <div className="result-item">
              <span className="label">Location:</span>
              <span className="value">{parcel.current_location || 'Not updated'}</span>
            </div>
            <div className="result-item">
              <span className="label">Created:</span>
              <span className="value">{new Date(parcel.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
