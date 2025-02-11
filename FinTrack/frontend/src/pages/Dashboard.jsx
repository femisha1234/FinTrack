import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = ({ setToken }) => {
  const [transactions, setTransactions] = useState({ incomeTransactions: [], expenseTransactions: [] });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [savings, setSavings] = useState(0);
  const [chartData, setChartData] = useState({
    spendingData: { labels: [], datasets: [] },
    incomeExpenseData: { labels: [], datasets: [] },
  });

  const navigate = useNavigate();

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Transactions:", response.data); // check the data structure
        setTransactions(response.data); // updating the state with fetched data

        // Combine income and expense transactions into a single array
        const allTransactions = [
          ...response.data.incomeTransactions,
          ...response.data.expenseTransactions,
        ];
        processTransactionData(allTransactions); // process data for charts
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Process transaction data for charts and totals
  const processTransactionData = (transactions) => {
    let income = 0;
    let expenses = 0;
    let categories = {};
    let weeklyIncome = [0, 0, 0, 0];
    let weeklyExpenses = [0, 0, 0, 0];

    transactions.forEach((txn) => {
      if (txn.type === "income") {
        income += txn.amount;
      } else if (txn.type === "expense") {
        expenses += txn.amount;
        categories[txn.category] = (categories[txn.category] || 0) + txn.amount;
      }

      const txnDate = new Date(txn.date);
      const week = Math.ceil(txnDate.getDate() / 7);

      if (txn.type === "income") weeklyIncome[week - 1] += txn.amount;
      if (txn.type === "expense") weeklyExpenses[week - 1] += txn.amount;
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setSavings(income - expenses);

    setChartData({
      spendingData: {
        labels: Object.keys(categories),
        datasets: [
          {
            label: "Spending by Category",
            data: Object.values(categories),
            backgroundColor: ["#f87171", "#34d399", "#60a5fa", "#fbbf24"],
          },
        ],
      },
      incomeExpenseData: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Income",
            data: weeklyIncome,
            borderColor: "#10b981",
            fill: false,
          },
          {
            label: "Expenses",
            data: weeklyExpenses,
            borderColor: "#ef4444",
            fill: false,
          },
        ],
      },
    });
  };

  const smallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

// Fetch user data on mount
useEffect(() => {
    fetchUserData();
}, []);

  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="dashboard">
        <div className="content container">
          <header className="d-flex justify-content-between align-items-center py-3">
            <h1>Welcome back!</h1>
            <p className="text-muted">{new Date().toDateString()}</p>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </header>

          <div className="row">
            <div className="col-md-3">
              <div className="card text-bg-success">
                <div className="card-body">
                  <h5 className="card-title">Total Income</h5>
                  <p className="card-text">₹{totalIncome}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-bg-danger">
                <div className="card-body">
                  <h5 className="card-title">Total Expenses</h5>
                  <p className="card-text">₹{totalExpenses}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h5 className="card-title">Savings</h5>
                  <p className="card-text">₹{savings}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-bg-warning">
                <div className="card-body">
                  <h5 className="card-title">Remaining Budget</h5>
                  <p className="card-text">₹{savings * 0.5}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h3>Spending Breakdown</h3>
              <div className="chart-container">
                {chartData.spendingData.labels.length > 0 ? (
                  <Pie data={chartData.spendingData} options={smallChartOptions} />
                ) : (
                  <p>No spending data available.</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <h3>Income vs Expenses</h3>
              <div className="chart-container">
                {chartData.incomeExpenseData.labels.length > 0 ? (
                  <Line data={chartData.incomeExpenseData} options={smallChartOptions} />
                ) : (
                  <p>No income/expense data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions mt-4">
            <h3>Quick Actions</h3>
            <Link to="/income">
              <button className="btn btn-primary">Add Income</button>
            </Link>
            <Link to="/expense">
              <button className="btn btn-danger">Add Expense</button>
            </Link>
            <Link to="/savings">
              <button className="btn btn-success">New Goal</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;