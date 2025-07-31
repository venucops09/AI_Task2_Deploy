import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TablePagination, TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';
import CustomerForm from '../components/CustomerForm';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [interactionsOpen, setInteractionsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [interactionsError, setInteractionsError] = useState(null);

  const fetchCustomers = async (pageNum = page, limitNum = rowsPerPage, searchVal = search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/customers', {
        params: {
          page: pageNum + 1,
          limit: limitNum,
          search: searchVal,
        },
      });
      setCustomers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search]);

  const handleAdd = () => {
    setEditCustomer(null);
    setOpen(true);
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCustomer(null);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editCustomer) {
        await api.put(`/customers/${editCustomer.id}`, values);
      } else {
        await api.post('/customers', values);
      }
      fetchCustomers();
      handleClose();
      resetForm();
    } catch (err) {
      setError('Failed to save customer');
    } finally {
      setSubmitting(false);
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

  // Interactions logic
  const handleViewInteractions = async (customer) => {
    setSelectedCustomer(customer);
    setInteractionsOpen(true);
    setInteractionsLoading(true);
    setInteractionsError(null);
    try {
      const res = await api.get('/interactions');
      setInteractions(res.data.filter(i => i.customer_id === customer.id));
    } catch (err) {
      setInteractionsError('Failed to load interactions');
    } finally {
      setInteractionsLoading(false);
    }
  };

  const handleCloseInteractions = () => {
    setInteractionsOpen(false);
    setSelectedCustomer(null);
    setInteractions([]);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Customers</Typography>
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 16 }}>
        <TextField
          placeholder="Search customers..."
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
      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>Add Customer</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.company}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleEdit(customer)}>Edit</Button>
                      <Button size="small" sx={{ ml: 1 }} onClick={() => handleViewInteractions(customer)}>
                        View Interactions
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
        <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <CustomerForm
            initialValues={editCustomer || {}}
            onSubmit={handleSubmit}
            submitLabel={editCustomer ? 'Update' : 'Add'}
          />
        </DialogContent>
      </Dialog>
      {/* Interactions Dialog */}
      <Dialog open={interactionsOpen} onClose={handleCloseInteractions} maxWidth="md" fullWidth>
        <DialogTitle>Contact History for {selectedCustomer?.name}</DialogTitle>
        <DialogContent>
          {interactionsLoading && <CircularProgress />}
          {interactionsError && <Alert severity="error">{interactionsError}</Alert>}
          {!interactionsLoading && !interactionsError && (
            <Box sx={{ mt: 2 }}>
              {interactions.length === 0 ? (
                <Typography>No interactions found for this customer.</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interactions.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell>{i.type}</TableCell>
                          <TableCell>{i.notes}</TableCell>
                          <TableCell>{i.interaction_time ? new Date(i.interaction_time).toLocaleString() : ''}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 