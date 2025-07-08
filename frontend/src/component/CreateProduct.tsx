import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './CreateProduct.module.css'; // If you use custom styles

export interface IFormData {
  name: string;
  description: string;
  price: number;
  category_name: string;
  thumbnails?: FileList | null;
}

interface IFormErrors {
  name?: string;
  description?: string;
  price?: string;
  category_name?: string;
  thumbnail?: string;
}

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    description: '',
    price: 0,
    category_name: '',
    thumbnails: null,
  });

  const [errors, setErrors] = useState<IFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFormData((prevData) => ({
      ...prevData,
      thumbnails: files,
    }));
  };

  const validateForm = (): boolean => {
    const formErrors: IFormErrors = {};
    let isValid = true;

    if (!formData.name) {
      formErrors.name = 'Product name is required.';
      isValid = false;
    } else if (formData.name.length < 2) {
      formErrors.name = 'Product name must be at least 2 characters.';
      isValid = false;
    } else if (formData.name.length > 100) {
      formErrors.name = 'Product name must be less than or equal to 100 characters.';
      isValid = false;
    }

    if (!formData.description) {
      formErrors.description = 'Description is required.';
      isValid = false;
    } else if (formData.description.length > 1000) {
      formErrors.description = 'Description must be less than or equal to 1000 characters.';
      isValid = false;
    }

    if (formData.price <= 0) {
      formErrors.price = 'Price must be greater than zero.';
      isValid = false;
    }

    if (!formData.category_name) {
      formErrors.category_name = 'Category is required.';
      isValid = false;
    }

    if (!formData.thumbnails || formData.thumbnails.length === 0) {
      formErrors.thumbnail = 'Please upload at least one image.';
      isValid = false;
    } else if (formData.thumbnails.length > 2) {
      formErrors.thumbnail = 'You can upload a maximum of 2 images.';
      isValid = false;
    } else {
      Array.from(formData.thumbnails).forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
          formErrors.thumbnail = 'File size should be less than 5MB.';
          isValid = false;
        }
      });
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const form = new FormData();
      form.append('product_name', formData.name);
      form.append('product_description', formData.description);
      form.append('product_price', formData.price.toString());
      form.append('category_name', formData.category_name);

      if (formData.thumbnails) {
        Array.from(formData.thumbnails).forEach((file) => {
          form.append('thumbnails', file);
        });
      }

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
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="container mt-3 col-6 h-auto py-2" style={{ backgroundColor: '#F0F4F8', borderRadius: '10px' }} >
          <div className="mb-3">
            <h3>Create New Product</h3>
            <label htmlFor="productName" className="form-label">Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="productName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              minLength={2}
              maxLength={100}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="productDesc" className="form-label">Description</label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              id="productDesc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
              maxLength={1000}
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="category_name" className="form-label">Category</label>
            <select
     className={`form-control ${errors.category_name ? 'is-invalid' : ''}`}
            id="category_name"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty">Beauty</option>
            </select>
            {errors.category_name && <div className="invalid-feedback">{errors.category_name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Enter product price"
              min={1}
              required
            />
            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="productThumbnail" className="form-label">Product Thumbnails</label>
            <input
              type="file"
              className={`form-control ${errors.thumbnail ? 'is-invalid' : ''}`}
              id="productThumbnail"
              name="thumbnails"
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
            {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail}</div>}
            <small className="form-text text-muted">Max 2 files. Max size 5MB each.</small>
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#A2D5C6',
                color: 'black',
                fontWeight: 500,
                padding: '8px 20px',
                borderRadius: '6px',
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
  );
};

export default CreateProduct;
