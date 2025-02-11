import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// User Login API
// User Login API
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Data from login API:', data); // Log the response

        if (!response.ok) {
            console.error('Error response:', data);
            throw new Error(data.error || "Login failed");
        }

        // Save the token and userId to localStorage
        if (data.token && data.userId) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.userId);
            console.log('Token and userId saved to localStorage');
        }

        return data;
    } catch (error) {
        console.error("Login Error:", error.message);
        return { error: error.message };
    }
};




//signup
export const signupUser = async (name, email, password) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        console.log('Response Data:', data); // Log the response data

        if (!response.ok) {
            console.error('Error Response:', data); // Log the error response
            throw new Error(data.msg || "Signup failed");
        }

        return data;
    } catch (error) {
        console.error("Signup Error:", error.message);
        return { error: error.message }; // Return the error message
    }
};


// Fetch Transactions API

// Add a Transaction (Income or Expense)
// Add a Transaction (Income or Expense)
export const addTransaction = async (transactionData) => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage

    if (!token) {
        throw new Error("No token found. Please login again.");
    }

    return await axios.post(API_URL, transactionData, {
        headers: { Authorization: `Bearer ${token}` } // Send token in the headers
    });
};

// Fetch Transactions for the Logged-in User
export const getTransactions = async () => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage

    if (!token) {
        throw new Error("No token found. Please login again.");
    }

    return await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` } // Send token in the headers
    });
};


