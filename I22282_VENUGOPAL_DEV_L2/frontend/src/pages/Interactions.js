import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Snackbar, IconButton, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const TYPES = ['call', 'email', 'meeting', 'other'];

export default function Interactions() {
  const [interactions, setInteractions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer_id: '', type: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchInteractions = async (searchVal = search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/interactions');
      let data = res.data;
      if (searchVal) {
        data = data.filter(i => {
          const customer = customers.find(c => c.id === i.customer_id);
          return (
            (customer?.name || '').toLowerCase().includes(searchVal.toLowerCase()) ||
            (i.type || '').toLowerCase().includes(searchVal.toLowerCase()) ||
            (i.notes || '').toLowerCase().includes(searchVal.toLowerCase())
          );
        });
      }
      setInteractions(data);
    } catch (err) {
      setError('Failed to load interactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.data || res.data);
    } catch {}
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchInteractions();
    // eslint-disable-next-line
  }, [customers]);

  const handleAdd = () => {
    setForm({ customer_id: '', type: '', notes: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/interactions', form);
      fetchInteractions();
      handleClose();
      setSnackbar({ open: true, message: 'Interaction added', severity: 'success' });
    } catch (err) {
      setError('Failed to save interaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/interactions/${id}`);
      fetchInteractions();
      setSnackbar({ open: true, message: 'Interaction deleted', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete interaction', severity: 'error' });
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchInteractions(searchInput);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Interactions</Typography>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 16 }}>
        <TextField
          placeholder="Search interactions..."
          value={searchInput}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <Button type="submit" variant="outlined" sx={{ ml: 1 }}>Search</Button>
      </form>
      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>Add Interaction</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interactions.map((interaction) => {
                const customer = customers.find(c => c.id === interaction.customer_id);
                return (
                  <TableRow key={interaction.id}>
                    <TableCell>{customer?.name || interaction.customer_id}</TableCell>
                    <TableCell>{interaction.type}</TableCell>
                    <TableCell>{interaction.notes}</TableCell>
                    <TableCell>{interaction.interaction_time ? new Date(interaction.interaction_time).toLocaleString() : ''}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" onClick={() => handleDelete(interaction.id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Interaction</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <TextField
              select
              label="Customer"
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
            />
            <Button type="submit" variant="contained" color="primary" disabled={submitting} sx={{ mt: 2 }}>
              Add Interaction
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
} 