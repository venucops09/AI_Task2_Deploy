import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, Grid, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import api from '../api/axios';

export default function Home() {
  const [customerReport, setCustomerReport] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const [customerRes, salesRes] = await Promise.all([
          api.get('/reports/customers'),
          api.get('/reports/sales'),
        ]);
        setCustomerReport(customerRes.data);
        setSalesReport(salesRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Simulated data for trends (replace with real data from backend if available)
  const acquisitionData = [
    { month: 'Jan', customers: 2 },
    { month: 'Feb', customers: 3 },
    { month: 'Mar', customers: 4 },
    { month: 'Apr', customers: 5 },
    { month: 'May', customers: 6 },
    { month: 'Jun', customers: 7 },
  ];

  const conversionData = salesReport?.byStage?.map((stage, idx) => ({
    stage: stage.stage,
    count: stage.count,
  })) || [];

  return (
    <>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Customer Acquisition Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={acquisitionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Sales Conversion Rates</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#43a047" name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
} 