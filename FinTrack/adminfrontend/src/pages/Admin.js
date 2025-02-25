import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom'; 

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/users');
        console.log('Fetched users:', response.data); 
        setUsers(response.data);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users'); // Set error if any
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

 
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    navigate('/'); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Sidebar />
      <div className="admin-container">
        <header>
          <h1>Welcome, Admin</h1>
          <div className="profile">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="card">
            <h3>Monthly Transactions</h3>
            <p>$25,430</p>
          </div>
          <div className="card">
            <h3>Active Sessions</h3>
            <p>{users.length}</p>
          </div>
        </section>

        <section className="data-table">
          <h2>User Management</h2>
          {users.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </section>
      </div>
    </>
  );
}

export default Admin;