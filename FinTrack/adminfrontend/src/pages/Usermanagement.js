import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Usermanagement.css';
import Sidebar from '../components/Sidebar';

function Usermanagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/users');
      const data = await response.json();
      console.log('Fetched Users:', data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
      setLoading(false);
    }
  };

  // Handle search filter
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle User Activation
  const handleActivate = async (id) => {
    try {
      console.log('Activating user with ID:', id);
      await axios.put(`http://localhost:5000/auth/users/${id}/activate`);
      setUsers(users.map((user) => (user._id === id ? { ...user, status: 'Active' } : user)));
    } catch (error) {
      console.error('Error activating user:', error.response?.data || error.message);
      alert('User not found or could not be activated.');
    }
  };

  // Handle User Deactivation
  const handleDeactivate = async (id) => {
    try {
      console.log('Deactivating user with ID:', id);
      await axios.put(`http://localhost:5000/auth/users/${id}/deactivate`);
      setUsers(users.map((user) => (user._id === id ? { ...user, status: 'Inactive' } : user)));
    } catch (error) {
      console.error('Error deactivating user:', error.response?.data || error.message);
      alert('User not found or could not be deactivated.');
    }
  };

  // Handle User Blocking
  const handleBlock = async (id) => {
    try {
      console.log('Blocking user with ID:', id);
      await axios.put(`http://localhost:5000/auth/users/${id}/block`);
      setUsers(users.map((user) => (user._id === id ? { ...user, status: 'Blocked' } : user)));
    } catch (error) {
      console.error('Error blocking user:', error.response?.data || error.message);
      alert('User not found or could not be blocked.');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="user-container">
        <header>
          <h1>User Management</h1>
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or email..."
            />
          </div>
        </header>

        <section className="user-table">
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p>{error}</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <span className={`status ${user.status?.toLowerCase() || 'unknown'}`}>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {user.status === 'Active' ? (
                        <button className="deactivate-btn" onClick={() => handleDeactivate(user._id)}>
                          Deactivate
                        </button>
                      ) : (
                        <button className="activate-btn" onClick={() => handleActivate(user._id)}>
                          Activate
                        </button>
                      )}
                      <button className="block-btn" onClick={() => handleBlock(user._id)}>
                        Block
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}

export default Usermanagement;