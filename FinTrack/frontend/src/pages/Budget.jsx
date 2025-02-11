import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Budget.css";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/transactions"; // Adjust based on your backend

function Budget() {
  const [transactions, setTransactions] = useState([]);

  // Fetch budget transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debugging
  
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("API Response:", response.data); // Debugging
        
        // Merging income and expense transactions
        const allTransactions = [
          ...response.data.incomeTransactions,
          ...response.data.expenseTransactions,
        ];
        setTransactions(allTransactions); // Set merged array to state
      } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
      }
    };
  
    fetchTransactions();
  }, []);

  const getTotal = (type) => {
    return transactions
      .filter((item) => item.type === type) // Now works because transactions is an array
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const totalIncome = getTotal("income");
  const totalExpense = getTotal("expense");
  const balance = totalIncome - totalExpense;

  return (
    <>
      <Sidebar />
      <div className="budget-container">
        <h2>Budget Management</h2>

        {/* Summary Section */}
        <div className="summary">
          <div className="summary-item">
            <h3>Total Income</h3>
            <p className="income"> ₹{totalIncome.toFixed(0)}</p>
          </div>
          <div className="summary-item">
            <h3>Total Expense</h3>
            <p className="expense"> ₹{totalExpense.toFixed(0)}</p>
          </div>
          <div className="summary-item">
            <h3>Balance</h3>
            <p className="balance"> ₹{balance.toFixed(0)}</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="transaction-list">
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.source}</td>
                    <td className={transaction.type === "income" ? "income-text" : "expense-text"}>
                      {transaction.type}
                    </td>
                    <td>₹{transaction.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Budget;
