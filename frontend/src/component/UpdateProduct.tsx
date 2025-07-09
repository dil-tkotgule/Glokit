import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, FormHelperText,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface IFormData {
  name: string;
  description: string;
  price: number | null;
  category_name: string;
  thumbnails?: FileList | null;
}

interface IPreview {
  name: string;
  size: string;
  src: string;
}

interface IFormErrors {
  name?: string;
  description?: string;
  price?: string;
  category_name?: string;
  thumbnails?: string;
}

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IFormData>({
    name: '',
    description: '',
    price: null,
    category_name: '',
    thumbnails: null,
  });

  const [errors, setErrors] = useState<IFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<IPreview[]>([]);
const [existingPreview, setExistingPreview] = useState<IPreview[]>([]);

// const [existingPreview, setExistingPreview] = useState<IPreview[]>([]);

// In useEffect, after fetching data:
// useEffect(() => {
//   axios.get(`http://localhost:3000/app/product/get/${id}`)
//     .then(res => {
//       const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;

//       setFormData({
//         name: data.product_name,
//         description: data.product_description,
//         price: Number(data.product_price),
//         category_name: data.category_name,
//         thumbnails: null,
//       });

//       // Assume data.images or data.thumbnails contains array of image URLs:
  

//       setLoading(false);
//     })
//     .catch(() => setLoading(false));
// }, [id]);


useEffect(() => {
    axios
      .get(`http://localhost:3000/app/product/get/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
console.log(data)
        setFormData({
          name: data.product_name,
          description: data.product_description,
          price: Number(data.product_price),
          category_name: data.category_name,
          thumbnails: null,
        });

            if (data.images && Array.isArray(data.images)) {
        // Map to preview format
        const existingPreviews = data.images.map((url: string, i: number) => ({
          name: `Image ${i + 1}`,
          size: '',  // size unknown for existing images
          src: url,
        }));
        setExistingPreview(existingPreviews);
      }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: name === 'price' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFormData(prev => ({ ...prev, thumbnails: files }));

    if (files) {
      const previews = Array.from(files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        src: URL.createObjectURL(file)
      }));
      setPreview(previews);
    }
  };

  const validateForm = () => {
    const newErrors: IFormErrors = {};
    let valid = true;

    if (!formData.name || formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Name must be 2–100 characters';
      valid = false;
    }

    if (!formData.description || formData.description.length > 1000) {
      newErrors.description = 'Description is required and must be under 1000 characters';
      valid = false;
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      valid = false;
    }

    if (!formData.category_name) {
      newErrors.category_name = 'Please select a category';
      valid = false;
    }

    if (!formData.thumbnails || formData.thumbnails.length === 0) {
      newErrors.thumbnails = 'At least 1 image required';
      valid = false;
    } else if (formData.thumbnails.length > 2) {
      newErrors.thumbnails = 'You can upload a maximum of 2 images';
      valid = false;
    } else {
      Array.from(formData.thumbnails).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          newErrors.thumbnails = 'Each file must be less than 5MB';
          valid = false;
        }
      });
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    form.append('product_name', formData.name);
    form.append('product_description', formData.description);
    form.append('product_price', formData.price?.toString() || '');
    form.append('category_name', formData.category_name);

    if (formData.thumbnails) {
      Array.from(formData.thumbnails).forEach(file => {
        form.append('thumbnails', file);
      });
    }

    try {
      await axios.put(`http://localhost:3000/app/product/update/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/product/${id}`);
    } catch (err: any) {
      setErrors({ thumbnails: err.response?.data?.error || 'Update failed' });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

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
        boxShadow: 2
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={500}>
        Update Product
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
          label="Price"
          name="price"
          type="number"
          fullWidth
          inputProps={{ min: 1 }}
          value={formData.price ?? ''}
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
          onChange={handleChange}
          error={Boolean(errors.description)}
          helperText={errors.description}
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
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Accessories">Accessories</MenuItem>
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
            Upload max 2 files (≤5MB). {errors.thumbnails}
          </FormHelperText>
        </FormControl>
      </Box>
<Box display="flex" flexWrap="wrap" gap={2} mt={2}>
  {existingPreview.map((file, i) => (
    <Box
      key={`existing-${i}`}
      display="flex"
      gap={1}
      p={1}
      border="1px solid #ccc"
      borderRadius={2}
    >
      <img
        src={file.src}
        alt={file.name}
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, opacity: 0.7 }}
      />
      <Box>
        <Typography variant="body2" noWrap>{file.name}</Typography>
        <Typography variant="caption">{file.size}</Typography>
      </Box>
    </Box>
  ))}

  {preview.map((file, i) => (
    <Box
      key={`new-${i}`}
      display="flex"
      gap={1}
      p={1}
      border="1px solid #ccc"
      borderRadius={2}
    >
      <img
        src={file.src}
        alt={file.name}
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
      />
      <Box>
        <Typography variant="body2" noWrap>{file.name}</Typography>
        <Typography variant="caption">{file.size}</Typography>
      </Box>
    </Box>
  ))}
</Box>

      {existingPreview.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
          {preview.map((file, i) => (
            <Box key={i} display="flex" gap={1} p={1} border="1px solid #ccc" borderRadius={2}>
              <img
                src={file.src}
                alt={file.name}
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
              />
              <Box>
                <Typography variant="body2" noWrap>{file.name}</Typography>
                <Typography variant="caption">{file.size}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box mt={3} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProduct;
