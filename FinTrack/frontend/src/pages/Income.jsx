import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Income.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [incomeData, setIncomeData] = useState({
    source: "",
    amount: "",
    category: "",
    date: "",
  });
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchIncome = async () => {
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
        if (response.ok && data.incomeTransactions) {
          const formattedIncome = data.incomeTransactions.map((income) => ({
            ...income,
            date: income.date.split("T")[0],
          }));
          setIncomes(formattedIncome);
          calculateTotal(formattedIncome);
        } else {
          setError("Failed to fetch income transactions.");
        }
      } catch (err) {
        setError("Failed to fetch income transactions.");
      }
    };
    fetchIncome();
  }, [token]);

  const calculateTotal = (incomeList) => {
    const totalIncome = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
    setTotal(totalIncome);
  };

  const handleChange = (e) => {
    setIncomeData({ ...incomeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incomeData.source || !incomeData.amount || !incomeData.category || !incomeData.date) {
      alert("All fields are required");
      return;
    }
    try {
      const transaction = {
        amount: parseFloat(incomeData.amount),
        type: "income",
        category: incomeData.category,
        date: incomeData.date,
        source: incomeData.source,
      };
  
      let res;
      if (editing) {
        res = await axios.put(`${API_URL}/transactions/${editing}`, transaction, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditing(null);
      } else {
        res = await axios.post(`${API_URL}/transactions`, transaction, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      setIncomes((prev) => {
        const updated = editing
          ? prev.map((income) => (income._id === editing ? { ...income, ...res.data } : income))
          : [...prev, res.data];
        calculateTotal(updated);
        return updated;
      });
  
      setIncomeData({ source: "", amount: "", category: "", date: "" });
    } catch (error) {
      alert("Error processing transaction.");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes((prev) => {
        const updated = prev.filter((income) => income._id !== id);
        calculateTotal(updated);
        return updated;
      });
    } catch (error) {
      alert("Error deleting income.");
    }
  };

  const handleEdit = (income) => {
    setIncomeData({
      source: income.source,
      amount: income.amount,
      category: income.category,
      date: income.date,
    });
    setEditing(income._id);
  };

  return (
    <>
      <Sidebar />
      <div className="income-container">
        <h1>Income Tracker</h1>
        {error && <p className="error-message">{error}</p>}
        <form id="income-form" onSubmit={handleSubmit}>
          <input type="text" name="source" placeholder="Income Name" value={incomeData.source} onChange={handleChange} required />
          <input type="number" name="amount" placeholder="Amount" value={incomeData.amount} onChange={handleChange} required />
          <select name="category" value={incomeData.category} onChange={handleChange} required>
            <option value="" disabled>Select Category</option>
            <option value="Job">Job</option>
            <option value="Part-time">Part-time</option>
            <option value="Investment">Investment</option>
          </select>
          <input type="date" name="date" value={incomeData.date} onChange={handleChange} required />
          <button type="submit" className="add-income-button">{editing ? "Update Income" : "Add Income"}</button>
        </form>
        <table className="income-table">
          <thead>
            <tr>
              <th>Income Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income._id}>
                <td>{income.source}</td>
                <td>₹{income.amount.toFixed(2)}</td>
                <td>{income.category}</td>
                <td>{income.date}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(income)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(income._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total">Total Income: ₹{total.toFixed(2)}</div>
      </div>
    </>
  );
}

export default Income;
