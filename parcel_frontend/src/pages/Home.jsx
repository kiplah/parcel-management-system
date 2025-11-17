import { Link } from 'react-router-dom';
import '../styles/Home.scss';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Parcel Management System</h1>
        <p>Track, manage, and review your parcels with ease</p>
        <div className="cta-buttons">
          <Link to="/parcels" className="btn btn-primary">View Parcels</Link>
          <Link to="/create-parcel" className="btn btn-secondary">Create Parcel</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📦 Parcel Tracking</h3>
          <p>Real-time tracking of your parcels with GPS coordinates</p>
        </div>
        <div className="feature-card">
          <h3>📍 Live Map</h3>
          <p>Visualize delivery routes on interactive maps</p>
        </div>
        <div className="feature-card">
          <h3>⭐ Reviews</h3>
          <p>Rate and review delivery services</p>
        </div>
        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Dashboard with detailed statistics and insights</p>
        </div>
        <div className="feature-card">
          <h3>📱 Barcode Scan</h3>
          <p>Quick parcel lookup using barcode scanning</p>
        </div>
        <div className="feature-card">
          <h3>📋 History</h3>
          <p>Complete delivery history of sent and received parcels</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
