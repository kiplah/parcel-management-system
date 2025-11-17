import { useState, useEffect } from 'react';
import { deliveryHistoryAPI } from '../services/api';
import '../styles/DeliveryHistory.scss';

function DeliveryHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await deliveryHistoryAPI.list();
      setHistory(response.data.results);
    } catch (err) {
      console.error('Failed to fetch delivery history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="delivery-history">
      <h1>📋 Delivery History</h1>
      
      {history.length === 0 ? (
        <p className="no-results">No delivery history found</p>
      ) : (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Parcel ID</th>
                <th>User</th>
                <th>Role</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.parcel}</td>
                  <td>{item.user_username}</td>
                  <td>{item.role}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DeliveryHistory;
