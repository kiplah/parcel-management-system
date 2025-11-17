import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parcelAPI } from '../services/api';
import '../styles/CreateParcel.scss';

function CreateParcel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tracking_number: '',
    parcel_type: 'package',
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    receiver_name: '',
    receiver_email: '',
    receiver_phone: '',
    receiver_address: '',
    weight: '',
    description: '',
    value: '',
    current_location: '',
    organization: 1,
    department: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await parcelAPI.create(formData);
      navigate('/parcels');
    } catch (err) {
      setError('Failed to create parcel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-parcel">
      <h1>Create New Parcel</h1>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="parcel-form">
        <div className="form-group">
          <label>Tracking Number *</label>
          <input
            type="text"
            name="tracking_number"
            value={formData.tracking_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Parcel Type *</label>
          <select name="parcel_type" value={formData.parcel_type} onChange={handleChange}>
            <option value="package">Package</option>
            <option value="document">Document</option>
            <option value="letter">Letter</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sender Name *</label>
            <input
              type="text"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sender Email</label>
            <input
              type="email"
              name="sender_email"
              value={formData.sender_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Receiver Name *</label>
            <input
              type="text"
              name="receiver_name"
              value={formData.receiver_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Receiver Email</label>
            <input
              type="email"
              name="receiver_email"
              value={formData.receiver_email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Receiver Address</label>
          <textarea
            name="receiver_address"
            value={formData.receiver_address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Value ($)</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Creating...' : 'Create Parcel'}
        </button>
      </form>
    </div>
  );
}

export default CreateParcel;
