import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parcelAPI } from '../services/api';
import '../styles/ParcelList.scss';

function ParcelList() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchParcels();
  }, [statusFilter]);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await parcelAPI.list(params);
      setParcels(response.data.results);
      setError(null);
    } catch (err) {
      setError('Failed to fetch parcels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredParcels = parcels.filter(parcel =>
    parcel.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading parcels...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="parcel-list">
      <h1>Parcels</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search by tracking number, sender, or receiver..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="lost">Lost</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {filteredParcels.length === 0 ? (
        <p className="no-results">No parcels found</p>
      ) : (
        <div className="parcels-grid">
          {filteredParcels.map(parcel => (
            <div key={parcel.id} className="parcel-card">
              <div className="parcel-header">
                <h3>{parcel.tracking_number}</h3>
                <span className={`status ${parcel.status}`}>{parcel.status_display}</span>
              </div>
              <div className="parcel-info">
                <p><strong>From:</strong> {parcel.sender_name}</p>
                <p><strong>To:</strong> {parcel.receiver_name}</p>
                <p><strong>Type:</strong> {parcel.type_display}</p>
                <p><strong>Location:</strong> {parcel.current_location || 'Not updated'}</p>
              </div>
              <div className="parcel-actions">
                <Link to={`/parcels/${parcel.id}`} className="btn-small">View Details</Link>
                <Link to={`/tracking/${parcel.id}`} className="btn-small">Track</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParcelList;
