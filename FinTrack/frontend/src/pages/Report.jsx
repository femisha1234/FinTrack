import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Report.css";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/transactions"; 

const Report = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Fetch all transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // Authentication token
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if the response contains separate arrays for income and expense
        if (response.data.incomeTransactions && response.data.expenseTransactions) {
          const allTransactions = [
            ...response.data.incomeTransactions,
            ...response.data.expenseTransactions,
          ];
          setTransactions(allTransactions);
          setFilteredTransactions(allTransactions); // Initially show all transactions
        } else {
          console.error("Unexpected response format", response.data);
          setTransactions([]);
          setFilteredTransactions([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions based on date range
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
    setFilteredTransactions(filtered);
  }, [startDate, endDate, transactions]);

  // Calculate totals
  const getTotal = (type) => {
    if (Array.isArray(filteredTransactions)) {
      return filteredTransactions
        .filter((transaction) => transaction.type === type)
        .reduce((acc, curr) => acc + curr.amount, 0);
    } else {
      console.error("filteredTransactions is not an array:", filteredTransactions);
      return 0;
    }
  };

  const totalIncome = getTotal("income");
  const totalExpense = getTotal("expense");
  const balance = totalIncome - totalExpense;

  // Calculate expenses per category
  const expenseCategories = useMemo(() => {
    return filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});
  }, [filteredTransactions]);

  // Calculate category percentages
  const categoriesPercentage = useMemo(() => {
    if (totalExpense === 0) return [];
    return Object.keys(expenseCategories).map((category) => ({
      name: category,
      percentage: (expenseCategories[category] / totalExpense) * 100,
    }));
  }, [expenseCategories, totalExpense]);

  // Generate conic gradient for pie chart
  const generateConicGradient = (categories, percentages) => {
    let gradient = "conic-gradient(";
    let startPercent = 0;

    categories.forEach((category, index) => {
      const endPercent = startPercent + percentages[index];
      gradient += `var(--color-${category.toLowerCase()}) ${startPercent}% ${endPercent}%, `;
      startPercent = endPercent;
    });

    return gradient.slice(0, -2) + ")";
  };

  const pieChartStyle = {
    background: totalExpense > 0 ? generateConicGradient(
      categoriesPercentage.map((c) => c.name),
      categoriesPercentage.map((c) => c.percentage)
    ) : "conic-gradient(transparent 0% 100%)",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    display: "block",
    margin: "0 auto",
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Sidebar />
      <div className="report-container">
        <h2>Financial Report</h2>

        {/* Date Filters */}
        <div className="date-filter">
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div> <br/><br/>

        {/* Summary Section */}
        <div className="report-summary">
          <div className="sum-item">
            <h3>Total Income</h3>
            <p className="income">₹{totalIncome.toFixed(0)}</p>
          </div>
          <div className="sum-item">
            <h3>Total Expenses</h3>
            <p className="expense">₹{totalExpense.toFixed(0)}</p>
          </div>
          <div className="sum-item">
            <h3>Balance</h3>
            <p className="balance">₹{balance.toFixed(0)}</p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="transaction-table">
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredTransactions) && filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.source}</td>
                    <td className={transaction.type}>{transaction.type}</td>
                    <td>₹{transaction.amount.toFixed(0)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expense Distribution Pie Chart */}
        <div className="report-visualization">
          <h3>Expense Distribution</h3>
          <div className="pie-chart" style={pieChartStyle}></div>
          <div className="legend">
            {categoriesPercentage.map((category, idx) => (
              <div key={idx}>
                <span
                  className={`legend-box ${category.name.toLowerCase()}`}
                  style={{ backgroundColor: `var(--color-${category.name.toLowerCase()})` }}
                ></span>{" "}
                {category.name} - {category.percentage.toFixed(1)}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
