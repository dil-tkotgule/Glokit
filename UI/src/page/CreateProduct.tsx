// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Close } from '@mui/icons-material';
// import {
//   Box,
//   Button,
//   TextField,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Select,
//   Typography,
//   FormHelperText,
// } from '@mui/material';

// import type { SelectChangeEvent } from '@mui/material';

// const MAX_IMAGES = 2;
// const MAX_IMAGE_SIZE_MB = 5;

// export interface IFormData {
//   name: string;
//   quantity: number;
//   description: string;
//   category_name: string;
//   thumbnails?: FileList | null;
// }

// interface IFormErrors {
//   name?: string;
//   quantity?: string;
//   category_name?: string;
//   description?: string;
//   thumbnails?: string;
// }

// const CreateProduct: React.FC = () => {
//   const [formData, setFormData] = useState<IFormData>({
//     name: '',
//     quantity: 0,
//     description: '',
//     category_name: '',
//     thumbnails: null,
//   });

//   const [errors, setErrors] = useState<IFormErrors>({});
//   const [preview, setPreview] = useState<{ src: string; name: string; size: string }[]>([]);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);  // Ref for file input
//   const navigate = useNavigate();

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: name === 'quantity' ? Number(value) : value,
//     }));
//     setErrors((prevData) => ({
//       ...prevData, [name]: ''
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     if (files.length > MAX_IMAGES) {
//       setErrors(prev => ({ ...prev, thumbnails: 'Select no more than two images.' }));
//       return;
//     }

//     for (const file of Array.from(files)) {
//       if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
//         setErrors(prevData => ({ ...prevData, thumbnails: 'Each image must be ≤ 5MB.' }));
//         return;
//       }
//     }

//     const previews = Array.from(files).map(file => ({
//       src: URL.createObjectURL(file),
//       name: file.name,
//       size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
//     }));
//     console.log(files);
//     console.log(previews);

//     setPreview(previews);
//     setErrors(prevData => ({ ...prevData, thumbnails: '' }));
//     setFormData(prevData => ({ ...prevData, thumbnails: files }));

//     // Reset the file input value so the user can select the same file again
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''; 
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedPreview = preview.filter((_, i) => i !== index);
//     setPreview(updatedPreview);
    
//     // Reset the thumbnails in form data if there are no images left
//     if (updatedPreview.length === 0) {
//       setFormData((prevData) => ({ ...prevData, thumbnails: null }));
//     }
//   };

//   const validate = (): boolean => {
//     const formErrors: IFormErrors = {};

//     if (formData.name.length < 2 || formData.name.length > 100 || !/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
//       formErrors.name = 'Product name must be between 2 and 100 characters and alphanumeric';
//     }

//     if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0 || !Number.isInteger(formData.quantity)) {
//       formErrors.quantity = 'Enter a valid integer quantity greater than 0';
//     }

//     if (!formData.category_name) {
//       formErrors.category_name = 'Category is required';
//     }
//     if (formData.description.length > 1000) {
//       formErrors.description = 'Description must be less than or equal to 1000 characters.';
//     }

//     if (!formData.thumbnails || formData.thumbnails.length > 2) {
//       formErrors.thumbnails = 'Max 2 images allowed';
//     }

//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const form = new FormData();
//     form.append('product_name', formData.name);
//     form.append('product_quantity', formData.quantity.toString());
//     form.append('product_description', formData.description);
//     form.append('category_name', formData.category_name);

//     if (formData.thumbnails) {
//       Array.from(formData.thumbnails).forEach(file => {
//         form.append('thumbnails', file);
//       });
//     }

//     console.log(form);
//     setFormData({
//       name: '',
//       description: '',
//       quantity: 0,
//       category_name: '',
//       thumbnails: null,
//     });

//     try {
//       await axios.post('http://localhost:3000/app/product/create', form, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       alert('Product created successfully!');
//       setFormData({
//         name: '',
//         description: '',
//         quantity: 0,
//         category_name: '',
//         thumbnails: null,
//       });
//       setErrors({});
//       navigate('/');
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   return (
//     <Box
//       component="form"
//       noValidate
//       onSubmit={handleSubmit}
//       sx={{
//         mt: 2,
//         maxWidth: 1000,
//         mx: 'auto',
//         p: 4,
//         backgroundColor: '#fff',
//         borderRadius: 2,
//         boxShadow: 2,
//         height: "auto"
//       }}
//     >
//       <Typography variant="h5" gutterBottom
//         sx={{
//           mb: 2,
//           fontWeight: 250
//         }}
//       >
//         Create Product
//       </Typography>

//       {/* Form Fields */}
//       <Box display="flex" gap={2} mb={3}>
//         <TextField
//           required
//           label="Name"
//           name="name"
//           fullWidth
//           value={formData.name}
//           onChange={handleChange}
//           error={Boolean(errors.name)}
//           helperText={errors.name}
//         />
//         <TextField
//           required
//           label="quantity"
//           name="quantity"
//           type="number"
//           fullWidth
//           inputProps={{ step: 1, min: 1 }}
//           value={formData.quantity}
//           onChange={handleChange}
//           error={Boolean(errors.quantity)}
//           helperText={errors.quantity}
//         />
//       </Box>

//       <Box mb={3}>
//         <TextField
//           label="Description"
//           name="description"
//           fullWidth
//           multiline
//           rows={3}
//           value={formData.description}
//           error={Boolean(errors.description)}
//           helperText={errors.description}
//           onChange={handleChange}
//         />
//       </Box>

//       {/* Category and Image Input */}
//       <Box display="flex" gap={2} mb={3}>
//         <FormControl fullWidth required error={Boolean(errors.category_name)}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             name="category_name"
//             value={formData.category_name}
//             onChange={handleChange}
//             label="Category"
//           >
//             <MenuItem value="">Choose...</MenuItem>
//             <MenuItem value="1">Electronics</MenuItem>
//             <MenuItem value="2">Clothing</MenuItem>
//             <MenuItem value="3">Accessories</MenuItem>
//           </Select>
//           <FormHelperText>{errors.category_name}</FormHelperText>
//         </FormControl>

//         <FormControl fullWidth error={Boolean(errors.thumbnails)}>
//           <Button variant="outlined" component="label">
//             Choose Files
//             <input
//               ref={fileInputRef} // Using ref to reset file input
//               type="file"
//               name="thumbnails"
//               accept="image/*"
//               multiple
//               hidden
//               onChange={handleFileChange}
//             />
//           </Button>

//           <FormHelperText>
//             Only two images allowed, and each image must be less than 5MB.
//             {errors.thumbnails && ` — ${errors.thumbnails}`}
//           </FormHelperText>

//           {/* Image Preview */}
//           <Box mt={1} display="flex" gap={1} flexWrap="nowrap">
//             {preview.map((file, index) => (
//               <Box
//                 key={index}
//                 display="flex"
//                 alignItems="center"
//                 gap={1}
//                 sx={{
//                   p: 1,
//                   borderRadius: 2,
//                   border: '1px solid #ddd',
//                   backgroundColor: '#fdfdfd',
//                   width: 215,
//                   justifyContent: 'center',
//                   position: 'relative',
//                 }}
//               >
//                 <img
//                   src={file.src}
//                   alt={`preview-${index}`}
//                   style={{
//                     width: 60,
//                     height: 60,
//                     objectFit: 'cover',
//                     borderRadius: 4,
//                     border: '1px solid #ccc',
//                   }}
//                 />

//                 {/* Close Button */}
//              <Box
//   onClick={() => handleRemoveImage(index)} // Remove image
//   sx={{
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: '#fff',
//     borderRadius: '50%', // This makes it circular
//     padding: 0.5, // Ensure there's space around the icon
//     cursor: 'pointer',
//     boxShadow: 2,
//     display: 'flex',
//     justifyContent: 'center', // Center the icon inside the circle
//     alignItems: 'center', // Center the icon inside the circle
//   }}
// >
//   <Close sx={{ fontSize: 12, color: 'red', opacity: 0.7 }} />
// </Box>


//                 <Box overflow="hidden">
//                   <Typography
//                     variant="body2"
//                     noWrap
//                     sx={{ fontSize: 13, color: 'green', fontWeight: 500 }}
//                   >
//                     {file.name}
//                   </Typography>
//                   <Typography
//                     variant="caption"
//                     sx={{ fontSize: 11, color: 'gray' }}
//                   >
//                     {file.size}
//                   </Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </FormControl>
//       </Box>

//       {/* Submit and Cancel Buttons */}
//       <Box mt={2} display="flex" gap={2}>
//         <Button type="submit" variant="contained" color="primary">
//           Create
//         </Button>
//         <Button variant="outlined" href="/">
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CreateProduct;
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
