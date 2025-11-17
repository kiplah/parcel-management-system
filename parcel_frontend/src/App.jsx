import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ParcelList from './pages/ParcelList';
import ParcelDetail from './pages/ParcelDetail';
import CreateParcel from './pages/CreateParcel';
import BarcodeScanner from './pages/BarcodeScanner';
import Reviews from './pages/Reviews';
import TrackingMap from './pages/TrackingMap';
import DeliveryHistory from './pages/DeliveryHistory';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/parcels" element={<ParcelList />} />
            <Route path="/parcels/:id" element={<ParcelDetail />} />
            <Route path="/create-parcel" element={<CreateParcel />} />
            <Route path="/scan-barcode" element={<BarcodeScanner />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/tracking/:id" element={<TrackingMap />} />
            <Route path="/delivery-history" element={<DeliveryHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
