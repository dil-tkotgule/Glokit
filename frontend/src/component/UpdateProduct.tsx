import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export interface IFormData {
  name: string;
  description: string;
  price: number | null;
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

  useEffect(() => {
    axios
      .get(`http://localhost:3000/app/product/get/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data.data) && res.data.data.length > 0
          ? res.data.data[0]
          : res.data.data;

        setFormData({
          name: data.product_name,
          description: data.product_description,
          price: data.product_price !== undefined ? Number(data.product_price) : null,
          category_name: data.category_name,
          thumbnails: null,
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? (value === '' ? null : Number(value)) : value,
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

    if (formData.price === null || formData.price <= 0) {
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
      console.log("hello")
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
      form.append('product_price', formData.price?.toString() || '');
      form.append('category_name', formData.category_name);

      if (formData.thumbnails) {
        Array.from(formData.thumbnails).forEach((file) => {
          form.append('thumbnails', file);
        });
      }

      try {
        await axios.put(`http://localhost:3000/app/product/update/${id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        navigate(`/product/${id}`);
      } catch (err: any) {
        setErrors({ thumbnail: err.response?.data?.error || 'Update failed' });
      }
    }
   
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="container mt-3 col-6 h-auto py-2" style={{ backgroundColor: '#F0F4F8', borderRadius: '10px' }} >
        <h2 className="mb-3">Update Product</h2>

        <div className="mb-2">
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

        <div className="mb-2">
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

        <div className="mb-2">
          <label htmlFor="category_name" className="form-label">Select Category</label>
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

        <div className="mb-2">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
            type="number"
            id="price"
            name="price"
            value={formData.price !== null ? formData.price : ''}
            onChange={handleChange}
            placeholder="Enter product price"
            required
            min={0}
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="mb-2">
          <label htmlFor="productThumbnail" className="form-label">Product Thumbnail</label>
          <input
            type="file"
            className={`form-control ${errors.thumbnail ? 'is-invalid' : ''}`}
            id="productThumbnail"
            name="thumbnails"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
           <small className="form-text text-muted">Max 2 files. Max size 5MB each.</small>
          {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail}</div>}
        </div>

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
              Update
            </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
