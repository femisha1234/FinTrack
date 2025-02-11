import React, { useState, useEffect } from "react";
import "./Expense.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [expenseData, setExpenseData] = useState({
    source: "",
    amount: "",
    category: "",
    date: "",
  });
  const [editing, setEditing] = useState(null); // Track editing state
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch expense transactions when component mounts or token changes
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) {
        setError("Please log in to view transactions.");
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (response.ok && data.expenseTransactions) {
          const formattedExpenses = data.expenseTransactions.map((expense) => ({
            ...expense,
            date: new Date(expense.date).toISOString().split("T")[0], // Format the date
          }));
          setExpenses(formattedExpenses);
          calculateTotal(formattedExpenses);
        } else {
          setError("Failed to fetch expense transactions.");
        }
      } catch (err) {
        setError("Failed to fetch expense transactions.");
      }
    };
  
    fetchExpenses();
  }, [token]);
  

  // Calculate total expenses
  const calculateTotal = (expenseList) => {
    const totalExpense = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    setTotal(totalExpense);
  };

  // Handle input changes
  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  // Handle Add / Update Expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expenseData.source || !expenseData.amount || !expenseData.category || !expenseData.date) {
      alert("All fields are required");
      return;
    }

    try {
      const transaction = {
        amount: parseFloat(expenseData.amount),
        type: "expense",
        category: expenseData.category,
        date: expenseData.date,
        source: expenseData.source,
      };

      let res;
      if (editing) {
        res = await axios.put(`${API_URL}/transactions/${editing}`, transaction, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses((prev) =>
          prev.map((expense) =>
            expense._id === editing ? { ...expense, ...res.data } : expense
          )
        );
        setEditing(null);
      } else {
        res = await axios.post(`${API_URL}/transactions`, transaction, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses((prev) => {
          const updated = [...prev, res.data];
          calculateTotal(updated);
          return updated;
        });
      }

      setExpenseData({ source: "", amount: "", category: "", date: "" });
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Error processing expense transaction.");
    }
  };

  // Handle Edit Button Click
  const handleEdit = (expense) => {
    setExpenseData({
      source: expense.source,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
    });
    setEditing(expense._id);
  };
  
  

  // Delete expense transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses((prev) => {
        const updated = prev.filter((expense) => expense._id !== id);
        calculateTotal(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="expense-container">
        <h1>Expense Tracker</h1>
        {error && <p className="error-message">{error}</p>}

        <form id="expense-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="source"
            placeholder="Expense Name"
            value={expenseData.source}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={expenseData.amount}
            onChange={handleChange}
            required
          />
          <select name="category" value={expenseData.category} onChange={handleChange} required>
            <option value="" disabled>
              Select Category
            </option>
            <option value="Transport">Transport</option>
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>

          </select>
          <input
            type="date"
            name="date"
            value={expenseData.date}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-expense-button">
            {editing ? "Update Expense" : "Add Expense"}
          </button>
        </form>

        <table className="expense-table">
          <thead>
            <tr>
              <th>Expense Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.source}</td>
                <td>₹{expense.amount.toFixed(2)}</td>
                <td>{expense.category}</td>
                <td>{expense.date}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(expense)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(expense._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total">Total Expense: ₹{total.toFixed(2)}</div>
      </div>
    </>
  );
}

export default Expense;
