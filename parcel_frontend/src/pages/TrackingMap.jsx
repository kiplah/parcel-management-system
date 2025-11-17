import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { parcelAPI, trackingAPI } from '../services/api';
import '../styles/TrackingMap.scss';

function TrackingMap() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const parcelRes = await parcelAPI.detail(id);
      setParcel(parcelRes.data);
      
      const locRes = await trackingAPI.locations(id);
      setLocations(locRes.data.results);
      
      const routeRes = await trackingAPI.routes(id);
      setRoutes(routeRes.data.results);
    } catch (err) {
      console.error('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tracking data...</div>;
  if (!parcel) return <div className="error">Parcel not found</div>;

  return (
    <div className="tracking-map">
      <h1>📍 Parcel Tracking</h1>
      
      <div className="tracking-container">
        <div className="parcel-info-card">
          <h2>{parcel.tracking_number}</h2>
          <p><strong>Status:</strong> {parcel.status_display}</p>
          <p><strong>From:</strong> {parcel.sender_name}</p>
          <p><strong>To:</strong> {parcel.receiver_name}</p>
          <p><strong>Current Location:</strong> {parcel.current_location || 'Not updated'}</p>
        </div>

        {locations.length > 0 && (
          <div className="locations-section">
            <h3>📍 Tracking Locations</h3>
            <div className="locations-timeline">
              {locations.map((location, idx) => (
                <div key={idx} className="location-item">
                  <div className="location-marker">
                    <span className="marker-number">{idx + 1}</span>
                  </div>
                  <div className="location-details">
                    <p><strong>{location.location_name}</strong></p>
                    <p>Lat: {location.latitude}, Lng: {location.longitude}</p>
                    <p>Status: {location.status}</p>
                    <small>{new Date(location.timestamp).toLocaleString()}</small>
                    {location.notes && <p className="notes">{location.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {routes.length > 0 && (
          <div className="routes-section">
            <h3>🛣️ Delivery Routes</h3>
            <div className="routes-list">
              {routes.map((route, idx) => (
                <div key={idx} className="route-item">
                  <p><strong>Route {route.route_sequence}:</strong> {route.from_location} → {route.to_location}</p>
                  <p>Distance: {route.distance_km} km | Status: {route.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackingMap;
