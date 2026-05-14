import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Predictions({ refresh }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    axios.get('https://smartspend-backend-wntp.onrender.com/api/predictions/', getAuthHeaders())
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);

  if (loading) return <p style={{ color: '#b2bec3' }}>Loading predictions...</p>;
  if (!data) return null;

  return (
    <div>
      <h2>🤖 Smart Insights</h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '600', color: '#6c5ce7' }}>₹{data.current_spending}</div>
          <div style={{ fontSize: '12px', color: '#636e72', marginTop: '4px' }}>Spent this month</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '600', color: '#00b894' }}>₹{data.daily_average}</div>
          <div style={{ fontSize: '12px', color: '#636e72', marginTop: '4px' }}>Daily average</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '600', color: '#fdcb6e' }}>₹{data.predicted_total}</div>
          <div style={{ fontSize: '12px', color: '#636e72', marginTop: '4px' }}>Predicted month end</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '600', color: '#e17055' }}>{data.days_remaining}</div>
          <div style={{ fontSize: '12px', color: '#636e72', marginTop: '4px' }}>Days remaining</div>
        </div>
      </div>

      {/* Trend */}
      <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>
            {data.trend_direction === 'up' ? '📈' : data.trend_direction === 'down' ? '📉' : '➡️'}
          </span>
          <span style={{ fontSize: '14px', color: '#2d3436' }}>{data.trend_message}</span>
        </div>
      </div>

      {/* Top Category */}
      {data.top_category && (
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', color: '#2d3436' }}>
            🏆 Biggest spend this month: <strong style={{ textTransform: 'capitalize' }}>{data.top_category}</strong> — ₹{data.top_category_amount}
          </div>
        </div>
      )}

      {/* Anomalies */}
      {data.anomalies.length > 0 && (
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#d63031', marginBottom: '8px' }}>
            ⚠️ Unusual Expenses Detected
          </div>
          {data.anomalies.map((item, index) => (
            <div key={index} style={{ fontSize: '13px', color: '#636e72', padding: '4px 0', borderBottom: '1px solid #f0f2f5' }}>
              {item.title} — ₹{item.amount} on {item.date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Predictions;