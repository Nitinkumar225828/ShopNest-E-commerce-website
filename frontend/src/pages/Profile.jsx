import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to read user from storage', error);
    return null;
  }
};

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const parsedUser = getStoredUser();
    const activeUser = user || parsedUser;

    if (!activeUser?.token) {
      if (!cancelled) setLoading(false);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${activeUser.token}` }
        });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok) {
            setOrders(Array.isArray(data) ? data : []);
          } else {
            setOrders([]);
          }
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setOrders([]);
          setLoading(false);
        }
      }
    };

    fetchMyOrders();

    return () => {
      cancelled = true;
    };
  }, [user, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
  const badgeStyle = { background: 'rgba(249,115,22,0.1)', color: '#f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block' };

  const currentUser = user || getStoredUser();

  if (!currentUser) return null;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '10px' }}>My Profile</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '5px' }}><strong>Name:</strong> {currentUser.username}</p>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '15px' }}><strong>Email:</strong> {currentUser.email}</p>
          <span style={badgeStyle}>Account Type: {(currentUser.role || 'user').toUpperCase()}</span>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', boxShadow: 'none' }}>Logout</button>
      </div>

      <h3 style={{ color: '#f97316', marginBottom: '20px', fontSize: '1.5rem' }}>Order History</h3>
      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Order ID: <span style={{ color: '#fff' }}>{order._id}</span></p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Placed On: <span style={{ color: '#fff' }}>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#10b981' }}>₹{Number(order.totalAmount ?? order.totalPrice ?? 0).toFixed(2)}</strong></p>
              </div>
              <div>
                <span style={{ 
                  background: (order.status || 'Pending') === 'Delivered' ? 'rgba(16,185,129,0.1)' : (order.status || 'Pending') === 'Shipped' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', 
                  color: (order.status || 'Pending') === 'Delivered' ? '#10b981' : (order.status || 'Pending') === 'Shipped' ? '#3b82f6' : '#f59e0b',
                  padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' 
                }}>
                  {order.status || 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;