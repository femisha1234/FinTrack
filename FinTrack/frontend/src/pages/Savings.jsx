import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, Filler, LineElement, PointElement, LinearScale, Title } from "chart.js";
import Sidebar from "../components/Sidebar";
import "./Savings.css";

ChartJS.register(Filler, LineElement, PointElement, LinearScale, Title);

const Savings = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalCurrentAmount, setGoalCurrentAmount] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [error, setError] = useState('');
  const [editableAmounts, setEditableAmounts] = useState({});

  // Fetch savings goals from backend
  useEffect(() => {
 const fetchSavings = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_URL}/savings`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  });

  if (!response.ok) {
      throw new Error("Failed to fetch savings data");
  }

  const data = await response.json();
  return data;
};
  fetchSavings();
  }, []);  // Empty dependency array to fetch once on component mount

  // Add new goal
  const addGoal = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        "http://localhost:5000/api/savings",
        {
          name: goalName,
          targetAmount: goalTargetAmount,
          currentAmount: goalCurrentAmount,
          deadline: goalDeadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Goal added:", response.data);
      setGoals((prevGoals) => [...prevGoals, response.data]); // Add new goal to the state
      setGoalName('');
      setGoalTargetAmount('');
      setGoalCurrentAmount('');
      setGoalDeadline('');
    } catch (error) {
      console.error("Error adding goal:", error);
      setError('Error adding goal');
    }
  };

  // Update goal amount
  const handleAmountChange = (goalId, newAmount) => {
    setEditableAmounts((prev) => ({
      ...prev,
      [goalId]: newAmount,
    }));
  };

  const updateGoalAmount = async (goalId, newAmount) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `http://localhost:5000/api/savings/${goalId}`,
        { currentAmount: newAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Goal updated:', response.data);
      // Optionally update the local state here if needed
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/savings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // Chart data
  const chartData = {
    labels: goals.map((goal) => goal.name),
    datasets: [
      {
        label: "Current Savings",
        data: goals.map((goal) => goal.currentAmount),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Target Amount",
        data: goals.map((goal) => goal.targetAmount),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <>
      <Sidebar />
      <div className="savings-goals">
        <div className="goal-form">
          <input
            type="text"
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={goalTargetAmount}
            onChange={(e) => setGoalTargetAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Current Savings"
            value={goalCurrentAmount}
            onChange={(e) => setGoalCurrentAmount(e.target.value)}
          />
          <input
            type="date"
            value={goalDeadline}
            onChange={(e) => setGoalDeadline(e.target.value)}
          />
          <button onClick={addGoal}>Add Goal</button>
          {error && <p>{error}</p>}
        </div>

        {/* Chart */}
        <div className="chart-container">
          <Line data={chartData} />
        </div>

        {/* Goal List */}
        <div className="goals-list">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal._id} className="goal-card">
                <h3>{goal.name}</h3>
                <p>Target: ₹{goal.targetAmount}</p>
                <p>Saved: ₹{goal.currentAmount}</p>
                <input
                  type="number"
                  value={editableAmounts[goal._id] || goal.currentAmount}
                  onChange={(e) => handleAmountChange(goal._id, e.target.value)}
                />
                <button onClick={() => updateGoalAmount(goal._id, editableAmounts[goal._id] || goal.currentAmount)}>
                  Update Amount
                </button>
                <button className="delete-btn" onClick={() => deleteGoal(goal._id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No savings goals found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Savings;
