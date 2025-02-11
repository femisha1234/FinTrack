import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';
import Sidebar from '../components/Sidebar';

const Settings = () => {
    const [theme, setTheme] = useState('light');
    const [currency, setCurrency] = useState('USD');
    const [notifications, setNotifications] = useState({
        email: true,
        alerts: true,
    });

    const [userData, setUserData] = useState({ name: '', email: '' });
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Fetch user data and set theme on component mount
    useEffect(() => {
        // Get theme from localStorage and set it
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.body.className = savedTheme; // Apply theme to body

        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/auth/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value;
        setTheme(selectedTheme);
        document.body.className = selectedTheme; // Apply the selected theme to the body
        localStorage.setItem('theme', selectedTheme); // Store the selected theme in localStorage
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
        localStorage.setItem('currency', e.target.value);
    };

    const handleNotificationsChange = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
        localStorage.setItem('notifications', JSON.stringify(notifications));
    };

    const handleEditProfile = () => {
        setEditMode(true);
        setNewName(userData.name);
        setNewPassword('');
    };

    const handleSaveProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found');
            return;
        }

        try {
            const updateData = { name: newName, password: newPassword };
            await axios.put(
                'http://localhost:5000/auth/me',
                updateData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // After updating the profile, fetch the updated data
            setUserData({ ...userData, name: newName });
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    return (
        <>
            <Sidebar />
            <div className='settings-page'>
                <h1>Settings</h1>

                <section className='profile'>
                    <h2>Profile</h2>
                    <div className='profile-icon'>
                        {/* Profile Icon */}
                        <i className="fas fa-user-circle" style={{fontSize:'34px',marginLeft:'10px'}}></i>
                    </div>
                    {editMode ? (
                        <div>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button onClick={handleSaveProfile}>Save</button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p>Name: {userData.name}</p>
                            <p>Email: {userData.email}</p>
                            <button  id='edit' onClick={handleEditProfile}>Edit Profile</button>
                        </div>
                    )}
                </section>

                <section className='preference'>
                    <h2>Preferences</h2>
                    <div>
                        <label htmlFor="theme">Theme:</label>
                        <select id="theme" value={theme} onChange={handleThemeChange}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="currency">Currency:</label>
                        <select id="currency" value={currency} onChange={handleCurrencyChange}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="INR">INR</option>
                        </select>
                    </div>
                </section>

                <section className='notifications'>
                    <h2>Notifications</h2>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={() => handleNotificationsChange('email')}
                            />
                            Email Notifications
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={notifications.alerts}
                                onChange={() => handleNotificationsChange('alerts')}
                            />
                            Spending Alerts
                        </label>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Settings;
