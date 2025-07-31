import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Snackbar, TablePagination, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Closed'];
const ALLOWED_TRANSITIONS = {
  Lead: 'Qualified',
  Qualified: 'Proposal',
  Proposal: 'Closed',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer_id: '', status: 'Lead', source: '' });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');

  const fetchLeads = async (pageNum = page, limitNum = rowsPerPage, searchVal = search, statusVal = status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/leads', {
        params: {
          page: pageNum + 1,
          limit: limitNum,
          search: searchVal,
          status: statusVal,
        },
      });
      setLeads(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to load leads');
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
    fetchLeads();
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search, status]);

  const handleAdd = () => {
    setForm({ customer_id: '', status: 'Lead', source: '' });
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
      await api.post('/leads', form);
      fetchLeads();
      handleClose();
    } catch (err) {
      setError('Failed to save lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStageTransition = async (lead) => {
    const nextStage = ALLOWED_TRANSITIONS[lead.status];
    if (!nextStage) return;
    try {
      await api.put(`/leads/${lead.id}`, { status: nextStage });
      setSnackbar({ open: true, message: `Lead moved to ${nextStage}`, severity: 'success' });
      fetchLeads();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Transition failed', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(0);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Leads</Typography>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <TextField
          placeholder="Search leads..."
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
        <TextField
          select
          label="Stage"
          value={status}
          onChange={handleStatusChange}
          size="small"
          style={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          {STAGES.map((stage) => (
            <MenuItem key={stage} value={stage}>{stage}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="outlined">Search</Button>
      </form>
      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>Add Lead</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => {
                  const nextStage = ALLOWED_TRANSITIONS[lead.status];
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>{customers.find(c => c.id === lead.customer_id)?.name || lead.customer_id}</TableCell>
                      <TableCell>{lead.status}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        {nextStage && (
                          <Button size="small" variant="outlined" onClick={() => handleStageTransition(lead)}>
                            Move to {nextStage}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Lead</DialogTitle>
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
              label="Stage"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {STAGES.map((stage) => (
                <MenuItem key={stage} value={stage}>{stage}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Source"
              name="source"
              value={form.source}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" disabled={submitting} sx={{ mt: 2 }}>
              Add Lead
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