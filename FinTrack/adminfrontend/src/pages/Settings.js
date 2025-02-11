import React, { useState } from 'react';
import './Settings.css';
import Sidebar from '../Components/Sidebar';

const Settings = () => {
    const [theme, setTheme] = useState('light');
    const [currency, setCurrency] = useState('USD');
    const [notifications, setNotifications] = useState({
        email: true,
        alerts: true,
    });

    const handleThemeChange = (e) => setTheme(e.target.value);
    const handleCurrencyChange = (e) => setCurrency(e.target.value);
    const handleNotificationsChange = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    return (
        <>
        <Sidebar/>
        <div className='settings-page'>
            <h1>Settings</h1>
            
            <section className='profile'>
                <h2>Profile</h2>
                <button>Edit Profile</button>
            </section>

            <section className='preference'>
                <h2>Preferences</h2>
                <div>
                    <label htmlFor="theme">Theme:</label>
                    <select id="theme" value={theme} onChange={handleThemeChange}>
                        <option value="light">Light</option>
                        <option value="dark" >Dark</option>
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

            <section className='security'>
                <h2>Security</h2>
                <button className='button1'> Enable Two-Factor Authentication</button>
                <button className='button1'>Change Password</button>
            </section>

            <section className='account'> 
                <h2>Account Management</h2>
                <button className='button1'>Manage Linked Accounts</button>
                <button className="danger">Delete Account</button>
            </section>

            <section className='about'>
                <h2>About & Support</h2>
                <button className='button1'>About the App</button>
                <button className='button1'> Contact Support</button>
            </section>
        </div>
        </>
    );
};

export default Settings;