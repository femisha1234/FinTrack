import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';
import './Analytics.css';
import Sidebar from '../Components/Sidebar';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    totalTransactions: 0,
    incomeData: [],
    expenseData: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch analytics data from the backend
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You are not authenticated. Please log in.');
      setLoading(false);
      window.location.href = '/login'; // Redirect to login page
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://192.168.1.52:5000/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
          params: { start: dateRange.start, end: dateRange.end },
        });
        setAnalyticsData({
          totalRevenue: response.data.totalIncome,
          totalExpense: response.data.totalExpense,
          netProfit: response.data.totalIncome - response.data.totalExpense,
          totalTransactions: response.data.totalTransactions,
          incomeDataData: response.data.incomeData,
          expenseData: response.data.expenseData,
          transactions: response.data.transactions,
        });
        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken'); // Clear the expired token
          window.location.href = '/login'; // Redirect to login page
        } else {
          console.error('Error fetching analytics:', error);
          setError('Failed to fetch analytics data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div style={{ padding: '20px' }} className="analytics-container">
        {/* Header */}
        <Typography variant="h4" gutterBottom className="analytics-header">
          Financial Analytics
        </Typography>

        {/* Date Range Picker */}
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Summary Cards */}
        <Grid container spacing={3} className="grid-container">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card">
              <CardContent>
                <Typography color="textSecondary">Total Revenue</Typography>
                <Typography variant="h5">${analyticsData.totalRevenue}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Expenses</Typography>
                <Typography variant="h5">${analyticsData.totalExpense}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Net Profit</Typography>
                <Typography variant="h5">${analyticsData.netProfit}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Transactions</Typography>
                <Typography variant="h5">{analyticsData.totalTransactions}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Revenue
                </Typography>
                <BarChart width={500} height={300} data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Distribution
                </Typography>
                <PieChart width={500} height={300}>
                  <Pie data={analyticsData.expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label />
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Data Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.transactions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.source}</TableCell>
                      <TableCell>${row.amount}</TableCell>
                      <TableCell>{row.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Analytics;