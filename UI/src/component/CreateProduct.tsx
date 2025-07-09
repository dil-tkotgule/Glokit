import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Typography,
  FormHelperText,
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';

const MAX_IMAGES = 2;
const MAX_IMAGE_SIZE_MB = 5;

export interface IFormData {
  name: string;
  price: number;
  description: string;
  category_name: string;
  thumbnails?: FileList | null;
}

interface IFormErrors {
  name?: string;
  price?: string;
  category_name?: string;
  description?: string;
  thumbnails?: string;
}

const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    price: 0,
    description: '',
    category_name: '',
    thumbnails: null,
  });

  const [errors, setErrors] = useState<IFormErrors>({});
  const [preview, setPreview] = useState<{ src: string; name: string; size: string }[]>([]);
  const navigate = useNavigate();


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? Number(value) : value,
    }));
    setErrors((prevData) => ({
      ...prevData, [name]: ''
    }));

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length > MAX_IMAGES) {
      setErrors(prev => ({ ...prev, thumbnails: 'Select no more than two images.' }));
      return;
    }

    for (const file of Array.from(files)) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setErrors(prevData => ({ ...prevData, thumbnails: 'Each image must be ≤ 5MB.' }));
        return;
      }
    }

    const previews = Array.from(files).map(file => ({
      src: URL.createObjectURL(file),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }));
    setPreview(previews);
    setErrors(prevData => ({ ...prevData, thumbnails: '' }));
    setFormData(prevData => ({ ...prevData, thumbnails: files }));
  };

  const validate = (): boolean => {
    const formErrors: IFormErrors = {};

    if (formData.name.length < 2 || formData.name.length > 100 || !/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
      formErrors.name = 'Product name must be between 2 and 100 characters and alphanumeric';
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0 || !Number.isInteger(formData.price)) {
      formErrors.price = 'Enter a valid integer price greater than 0';
    }


    if (!formData.category_name) {
      formErrors.category_name = 'Category is required';
    }
    if (formData.description.length > 1000) {
      formErrors.description = 'Description must be less than or equal to 1000 characters.';
    }

    if (!formData.thumbnails || formData.thumbnails.length > 2) {
      formErrors.thumbnails = 'Max 2 images allowed';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const form = new FormData();
    form.append('product_name', formData.name);
    form.append('product_price', formData.price.toString());
    form.append('product_description', formData.description);
    form.append('category_name', formData.category_name);

    if (formData.thumbnails) {
      Array.from(formData.thumbnails).forEach(file => {
        form.append('thumbnails', file);
      });
    }

    console.log(form);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_name: '',
      thumbnails: null,
    });

    try {
      await axios.post('http://localhost:3000/app/product/create', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product created successfully!');
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_name: '',
        thumbnails: null,
      });
      setErrors({});
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        maxWidth: 1000,
        mx: 'auto',
        p: 4,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        height: "auto"
      }}
    >
      <Typography variant="h5" gutterBottom
        sx={{
          mb: 2,
          fontWeight: 250
        }}
      >
        Create Product
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          required
          label="Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          required
          label="price"
          name="price"
          type="number"
          fullWidth
          inputProps={{ step: 1, min: 1 }}
          value={formData.price}
          onChange={handleChange}
          error={Boolean(errors.price)}
          helperText={errors.price}
        />
      </Box>

      <Box mb={3}>
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          error={Boolean(errors.description)}
          helperText={errors.description}
          onChange={handleChange}
        />
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth required error={Boolean(errors.category_name)}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="">Choose...</MenuItem>
            <MenuItem value="1">Electronics</MenuItem>
            <MenuItem value="2">Clothing</MenuItem>
            <MenuItem value="3">Accessories</MenuItem>
          </Select>
          <FormHelperText>{errors.category_name}</FormHelperText>
        </FormControl>

        <FormControl fullWidth error={Boolean(errors.thumbnails)}>
          <Button variant="outlined" component="label">
            Choose Files
            <input
              type="file"
              name="thumbnails"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </Button>

          <FormHelperText>
            Thumbnails (2 images, ≤5MB)
            {errors.thumbnails && ` — ${errors.thumbnails}`}
          </FormHelperText>

          <Box mt={1} display="flex" gap={2} flexWrap="wrap">
            {preview.map((file, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  border: '1px solid #ddd',
                  backgroundColor: '#fdfdfd',
                  width: 220,
                }}
              >
                <img
                  src={file.src}
                  alt={`preview-${index}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                  }}
                />

                <Box overflow="hidden">
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontSize: 13, color: 'green', fontWeight: 500 }}
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: 11, color: 'gray' }}
                  >
                    {file.size}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>


        </FormControl>

      </Box>

      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
        <Button variant="outlined" href="/">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CreateProduct;


