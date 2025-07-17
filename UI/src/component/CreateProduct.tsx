import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, MenuItem, InputLabel, FormControl,
  Select, Typography, FormHelperText, IconButton, Paper, Grid, Divider
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';

const MAX_IMAGES = 2;
const MAX_IMAGE_SIZE_MB = 5;

export interface IFormData {
  name: string;
  quantity: number;
  description: string;
  category_name: string;
  thumbnails?: File[];
}

interface IFormErrors {
  name?: string;
  quantity?: string;
  category_name?: string;
  description?: string;
  thumbnails?: string;
}

interface IImagePreview {
  src: string;
  name: string;
  size: string;
  file: File;
}

const CATEGORIES = [
  { value: 'Choose', label: 'Choose...' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Accessories', label: 'Accessories' },
];

const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    quantity: 0,
    description: '',
    category_name: 'Choose',
    thumbnails: [],
  });

  const [errors, setErrors] = useState<IFormErrors>({});
  const [previews, setPreviews] = useState<IImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      quantity: 0,
      description: '',
      category_name: 'Choose',
      thumbnails: [],
    });
    setPreviews([]);
    setErrors({});
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'quantity' ? Number(value) : value,
      }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }, []);

  const validateImageFile = (file: File): string | null => {
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return `File "${file.name}" exceeds the ${MAX_IMAGE_SIZE_MB}MB limit.`;
    }
    return null;
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const currentFiles = formData.thumbnails || [];

    if (currentFiles.length + fileArray.length > MAX_IMAGES) {
      setErrors(prev => ({
        ...prev,
        thumbnails: `You can only upload a maximum of ${MAX_IMAGES} images.`,
      }));
      return;
    }

    for (const file of fileArray) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setErrors(prev => ({ ...prev, thumbnails: validationError }));
        return;
      }
    }

    const newPreviews: IImagePreview[] = fileArray.map(file => ({
      src: URL.createObjectURL(file),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file,
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      thumbnails: [...(prev.thumbnails || []), ...fileArray],
    }));
    setErrors(prev => ({ ...prev, thumbnails: '' }));

    e.target.value = '';
  }, [formData.thumbnails]);

  const handleImageDelete = useCallback((index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = (formData.thumbnails || []).filter((_, i) => i !== index);

    URL.revokeObjectURL(previews[index].src);
    setPreviews(updatedPreviews);
    setFormData(prev => ({ ...prev, thumbnails: updatedFiles }));
  }, [previews, formData.thumbnails]);

  const validateForm = (): boolean => {
    const formErrors: IFormErrors = {};

    if (!formData.name.trim()) {
      formErrors.name = 'Product name is required.';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      formErrors.name = 'Name must be 2–100 characters.';
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
      formErrors.name = 'Only letters, numbers, and spaces are allowed.';
    }

    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0) {
      formErrors.quantity = 'Enter a valid quantity > 0.';
    } else if (!Number.isInteger(formData.quantity)) {
      formErrors.quantity = 'quantity must be a whole number.';
    }

    if (!formData.category_name || formData.category_name === 'Choose') {
      formErrors.category_name = 'Select a category.';
    }

    if (formData.description.length > 1000) {
      formErrors.description = 'Max 1000 characters.';
    }

    if (!formData.thumbnails || formData.thumbnails.length === 0) {
      formErrors.thumbnails = 'At least one image is required.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('product_name', formData.name.trim());
      form.append('product_quantity', formData.quantity.toString());
      form.append('product_description', formData.description.trim());
      form.append('category_name', formData.category_name);

      formData.thumbnails?.forEach(file => form.append('thumbnails', file));

      await axios.post('http://localhost:3000/app/product/create', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // ✅ Send JWT/session cookie
      });

      alert('Product created successfully!');
      resetForm();
      navigate('/');
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    previews.forEach(preview => URL.revokeObjectURL(preview.src));
    navigate('/');
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 4, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
        Create New Product
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required fullWidth name="name" label="Product Name"
              value={formData.name} onChange={handleInputChange}
              error={!!errors.name} helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required fullWidth name="quantity" type="number" label="quantity"
              value={formData.quantity || ''} onChange={handleInputChange}
              error={!!errors.quantity} helperText={errors.quantity}
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.category_name} required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                fullWidth
                label="Category"
              >
                {CATEGORIES.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category_name}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={4}
              name="description" label="Description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/1000`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.thumbnails}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ height: 56 }}
                disabled={previews.length >= MAX_IMAGES}
              >
                {previews.length >= MAX_IMAGES ? 'Max images uploaded' : 'Upload Images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                  disabled={previews.length >= MAX_IMAGES}
                />
              </Button>
              <FormHelperText>
                {errors.thumbnails || `Max ${MAX_IMAGES} images, ${MAX_IMAGE_SIZE_MB}MB each`}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                minHeight: 160,
                border: '1px dashed #ccc',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexWrap: 'wrap',
                mt: 2,
                gap: 2,
                justifyContent: 'flex-start',
              }}
            >
              {previews.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No images selected
                </Typography>
              ) : (
                previews.map((p, i) => (
                  <Paper key={i} sx={{ width: 140, height: 140, position: 'relative', p: 1 }}>
                    <IconButton
                      onClick={() => handleImageDelete(i)}
                      sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'white' }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <img
                      src={p.src}
                      alt={`preview-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                    />
                  </Paper>
                ))
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" gap={2}>
              <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CreateProduct;
