import React from 'react';
import { Button, TextField, Box } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email'),
  phone: Yup.string(),
  address: Yup.string(),
  company: Yup.string(),
});

export default function CustomerForm({ initialValues = {}, onSubmit, submitLabel = 'Save' }) {
  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={CustomerSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form noValidate>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              fullWidth
            />
            <TextField
              label="Company"
              name="company"
              value={values.company}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.company && Boolean(errors.company)}
              helperText={touched.company && errors.company}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
} 