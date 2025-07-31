import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Snackbar } from '@mui/material';
import api from '../api/axios';

function isDueSoon(dueDate) {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;
  return diff > 0 && diff <= 24 * 60 * 60 * 1000;
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', status: '', assigned_to: '', customer_id: '', due_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderTask, setReminderTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {}
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.data || res.data);
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchCustomers();
  }, []);

  // In-app reminders for tasks due soon
  useEffect(() => {
    const soonTask = tasks.find(t => isDueSoon(t.due_date) && t.status !== 'Completed');
    if (soonTask) {
      setReminderTask(soonTask);
      setReminderOpen(true);
    }
  }, [tasks]);

  const handleAdd = () => {
    setForm({ title: '', status: '', assigned_to: '', customer_id: '', due_date: '' });
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
      await api.post('/tasks', form);
      fetchTasks();
      handleClose();
    } catch (err) {
      setError('Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Tasks</Typography>
      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>Add Task</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} sx={isDueSoon(task.due_date) && task.status !== 'Completed' ? { bgcolor: '#fffde7' } : {}}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{users.find(u => u.id === task.assigned_to)?.username || task.assigned_to}</TableCell>
                  <TableCell>{customers.find(c => c.id === task.customer_id)?.name || task.customer_id}</TableCell>
                  <TableCell>{task.due_date ? new Date(task.due_date).toLocaleString() : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              select
              label="Assigned To"
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Customer"
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date"
              name="due_date"
              type="datetime-local"
              value={form.due_date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={submitting} sx={{ mt: 2 }}>
              Add Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={reminderOpen && !!reminderTask}
        autoHideDuration={8000}
        onClose={() => setReminderOpen(false)}
        message={reminderTask ? `Reminder: Task '${reminderTask.title}' is due soon!` : ''}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
} 