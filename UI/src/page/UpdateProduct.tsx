import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const MAX_IMAGES = 2;
const MAX_IMAGE_SIZE_MB = 5;
const BACKEND_URL = 'http://localhost:3000';

interface IFormData {
  name: string;
  description: string;
  quantity: number;
  category_name: string;
  thumbnails: File[];  // all images as files
}

interface IFormErrors {
  name?: string;
  description?: string;
  quantity?: string;
  category_name?: string;
  thumbnails?: string;
}

interface IImagePreview {
  src: string;
  name: string;
  size: string;
  file: File;
}

const CATEGORIES = [
  { value: '', label: 'Choose...' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Accessories', label: 'Accessories' },
];

// Helper to fix backend URL for images
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  const idx = imagePath.indexOf('uploads');
  if (idx === -1) return imagePath;
  const urlPath = imagePath.substring(idx).replace(/\\/g, '/');
  return `${BACKEND_URL}/${urlPath}`;
};

// Convert image URL to File object
async function urlToFile(url: string, filename: string, mimeType?: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType || blob.type });
}

const UpdateProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IFormData>({
    name: '',
    description: '',
    quantity: 0,
    category_name: '',
    thumbnails: [],
  });

  const [errors, setErrors] = useState<IFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPreviews, setNewPreviews] = useState<IImagePreview[]>([]);
  const [loading, setLoading] = useState(true);

  // Load product and convert existing images into File objects
  useEffect(() => {
    const fetchProductData = async () => {
     try {
  const res = await axios.get(`${BACKEND_URL}/app/product/get/${id}`, {
    withCredentials: true,
  });
  const items = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
  if (!items.length) return;

  const main = {
    ...items[0],
    images: items[0].image_urls ? items[0].image_urls.split(',') : [],
  };

  console.log('Fetched product:', main);
  setFormData({
    name: main.product_name || '',
    description: main.product_description || '',
    quantity: Number(main.product_quantity) || 0,
    category_name: main.category_name || '',
    thumbnails: [], // will fill below
  });

  // Convert each image URL to File object
  const files: File[] = await Promise.all(
    main.images.map(async (imageUrl: string, idx: number) => {
      const url = getImageUrl(imageUrl.trim());
      const extension = url.split('.').pop()?.split(/\#|\?/)[0] || 'jpg';
      const filename = `image_${idx + 1}.${extension}`;
      return await urlToFile(url, filename);
    })
  );

  // Create previews for UI
  const previews = files.map((file) => ({
    src: URL.createObjectURL(file),
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    file,
  }));

  setFormData((prev) => ({ ...prev, thumbnails: files }));
  setNewPreviews(previews);
} catch (error) {
  console.error('Failed to load product data', error);
} finally {
  setLoading(false);
}
    };

    fetchProductData();
  }, [id]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      category_name: '',
      thumbnails: [],
    });
    newPreviews.forEach((p) => URL.revokeObjectURL(p.src));
    setNewPreviews([]);
    setErrors({});
  }, [newPreviews]);

  const handleInputChange = useCallback((e: any) => {
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const fileArray = Array.from(files);
      const totalImages = formData.thumbnails.length + fileArray.length;

      if (totalImages > MAX_IMAGES) {
        setErrors((prev) => ({
          ...prev,
          thumbnails: `You can only upload a maximum of ${MAX_IMAGES} images.`,
        }));
        return;
      }

      for (const file of fileArray) {
        const err = validateImageFile(file);
        if (err) {
          setErrors((prev) => ({ ...prev, thumbnails: err }));
          return;
        }
      }

      const previews = fileArray.map((file) => ({
        src: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        file,
      }));

      setNewPreviews((prev) => [...prev, ...previews]);
      setFormData((prev) => ({
        ...prev,
        thumbnails: [...prev.thumbnails, ...fileArray],
      }));
      setErrors((prev) => ({ ...prev, thumbnails: '' }));

      e.target.value = '';
    },
    [formData.thumbnails.length]
  );

  const handleImageDelete = useCallback(
    (index: number) => {
      const toRemove = newPreviews[index];
      if (toRemove) URL.revokeObjectURL(toRemove.src);

      setNewPreviews((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => {
        const updated = [...prev.thumbnails];
        updated.splice(index, 1);
        return { ...prev, thumbnails: updated };
      });

      setErrors((prev) => ({ ...prev, thumbnails: '' }));
    },
    [newPreviews]
  );

  const validateForm = () => {
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

    if (!formData.category_name) {
      formErrors.category_name = 'Select a category.';
    }

    if (formData.description.length > 1000) {
      formErrors.description = 'Max 1000 characters.';
    }

    if (formData.thumbnails.length === 0) {
      formErrors.thumbnails = 'At least one image is required.';
    } else if (formData.thumbnails.length > MAX_IMAGES) {
      formErrors.thumbnails = `You can upload a maximum of ${MAX_IMAGES} images.`;
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('product_name', formData.name.trim());
      form.append('product_description', formData.description.trim());
      form.append('product_quantity', formData.quantity.toString());
      form.append('category_name', formData.category_name);

      formData.thumbnails.forEach((file) => {
        form.append('thumbnails', file);
      });

      await axios.put(`${BACKEND_URL}/app/product/update/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast.success('Product updated successfully!', {
        onClose: () => navigate('/'),
      });
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product.', {
        onClose: () => navigate('/'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    newPreviews.forEach((p) => URL.revokeObjectURL(p.src));
    navigate(-1);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4, mt: 4, borderRadius: 2, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Update Product
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                />
              </Grid>
            </Grid>

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              minRows={4}
              sx={{ mt: 2 }}
              error={!!errors.description}
              helperText={errors.description}
            />
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
          <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </Button>
        </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth required error={!!errors.category_name} sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_name"
                label="Category"
                value={formData.category_name}
                onChange={handleInputChange}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category_name}</FormHelperText>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              fullWidth
              disabled={formData.thumbnails.length >= MAX_IMAGES}
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
            >
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
            </Button>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Max {MAX_IMAGES} images, {MAX_IMAGE_SIZE_MB}MB each
            </Typography>
            <FormHelperText error>{errors.thumbnails}</FormHelperText>

         <Box
           display={'flex'}
         justifyContent={'center'}
        alignItems={'center'}
  sx={{
    border: '2px dashed #ccc',
    borderRadius: 1,
    p: 1,
    minHeight: 150,
    background: '#f9f9f9',
  }}
>
  <ToastContainer
    autoClose={500}
  />
  <Grid container spacing={4}
    display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        >
    {newPreviews.map((img, i) => (
      <Grid
        item
        xs={12}
        key={`new-${i}`}
      
        sx={{ position: 'relative', backgroundColor: 'transparent' }} // fixed here
      >
        <img
          src={img.src}
          alt={img.name}
          style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
        />
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'white' }}
          onClick={() => handleImageDelete(i)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    ))}
  </Grid>
</Box>

          </Grid>
        </Grid>


      </Box>
    </Paper>
  );
};

export default UpdateProduct;
