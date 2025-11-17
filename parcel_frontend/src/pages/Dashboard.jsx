import { useState, useEffect } from 'react';
import { parcelAPI } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.scss';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const parcelRes = await parcelAPI.list();
      const allParcels = parcelRes.data.results;
      setParcels(allParcels);

      const statusCounts = {
        pending: 0,
        received: 0,
        in_transit: 0,
        delivered: 0,
        lost: 0,
        returned: 0,
      };

      allParcels.forEach(p => {
        if (statusCounts.hasOwnProperty(p.status)) {
          statusCounts[p.status]++;
        }
      });

      setStats(statusCounts);
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const pieData = stats ? [
    { name: 'Pending', value: stats.pending, color: '#FFB84D' },
    { name: 'Received', value: stats.received, color: '#4D94FF' },
    { name: 'In Transit', value: stats.in_transit, color: '#66BB6A' },
    { name: 'Delivered', value: stats.delivered, color: '#4CAF50' },
    { name: 'Lost', value: stats.lost, color: '#F44336' },
    { name: 'Returned', value: stats.returned, color: '#9C27B0' },
  ].filter(item => item.value > 0) : [];

  const barData = stats ? [
    { name: 'Pending', count: stats.pending },
    { name: 'Received', count: stats.received },
    { name: 'In Transit', count: stats.in_transit },
    { name: 'Delivered', count: stats.delivered },
    { name: 'Lost', count: stats.lost },
    { name: 'Returned', count: stats.returned },
  ] : [];

  const totalParcels = parcels.length;
  const deliveryRate = totalParcels > 0 ? ((stats.delivered / totalParcels) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Parcels</h3>
          <p className="stat-value">{totalParcels}</p>
        </div>
        <div className="stat-card">
          <h3>Delivered</h3>
          <p className="stat-value">{stats.delivered}</p>
        </div>
        <div className="stat-card">
          <h3>In Transit</h3>
          <p className="stat-value">{stats.in_transit}</p>
        </div>
        <div className="stat-card">
          <h3>Delivery Rate</h3>
          <p className="stat-value">{deliveryRate}%</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Status Distribution (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Parcel Status Count (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
