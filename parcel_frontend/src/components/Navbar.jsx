import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📦 Parcel Manager
        </Link>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/parcels">Parcels</Link></li>
          <li><Link to="/create-parcel">Create Parcel</Link></li>
          <li><Link to="/scan-barcode">Scan</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
          <li><Link to="/delivery-history">History</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
