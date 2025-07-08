import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Paper, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface IProductUIThumbnail {
    product_id: number;
    product_name: string;
    product_description: string;
    product_price: number;
    product_category_id: number;
    category_name: string;
    image_url: string;
    file_size: number;
    created_at: Date;
    updated_at: Date;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProductUIThumbnail | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/app/product/get/${id}`);
      const data = response.data.data;
      if (Array.isArray(data) && data.length > 0) {
        setProduct(data[0]);
        setThumbnails(data.map((item: IProductUIThumbnail) => item.image_url));
      } else {
        setProduct(null);
        setThumbnails([]);
      }
    } catch (err) {
      setError('Error fetching product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const BACKEND_URL = 'http://localhost:3000';

  function getImageUrl(imagePath: string) {
    const idx = imagePath.indexOf('uploads');
    if (idx === -1) return '';
    const urlPath = imagePath.substring(idx).replace(/\\/g, '/');
    return `${BACKEND_URL}/${urlPath}`;
  }

  const handlePrev = () => {
    setCurrentImg((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImg((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>No product found</Typography>;

  return (
    <Paper sx={{ padding: 2, maxWidth: 700, margin: '32px auto', borderRadius: 4, boxShadow: 3 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 70 }}>
        {/* Image Carousel */}
        <div style={{ position: 'relative', width: 320, minWidth: 320, margin: '24px 0' }}>
          {thumbnails.length > 0 && (
            <>
              <img
                src={getImageUrl(thumbnails[currentImg])}
                alt={`Product Thumbnail ${currentImg + 1}`}
                style={{
                  width: 300,
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '1px solid #eee',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              {thumbnails.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrev}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.7)'
                    }}
                    aria-label="Previous image"
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.7)'
                    }}
                    aria-label="Next image"
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                  <div style={{ textAlign: 'center', marginTop: 8 }}>
                    {thumbnails.map((_, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: '60%',
                          background: idx === currentImg ? '#1976d2' : '#ccc',
                          margin: '0 4px'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {/* Product Details */}
        <div style={{ flex: 1, marginTop: 24 }}>
          <Typography variant="h4" gutterBottom>{product.product_name}</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Category: <b>{product.category_name}</b>
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Price: ${product.product_price}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{product.product_description}</Typography>
          {/* <Typography variant="body2" color="text.secondary">
            Created At: {new Date(product.created_at).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Updated At: {new Date(product.updated_at).toLocaleString()}
          </Typography> */}
          <button
            style={{ 
              marginTop: 10, 
              marginRight: 16, /* 2 * 8px (MUI spacing unit) */
              backgroundColor: '#A2D5C6',
              border:'none' ,
              color: '#000000' 
            }}
            className="btn btn-warning"
            onClick={() => navigate(`/product/update/${product.product_id}`)}
          >
            Update
          </button>
        </div>
      </div>
    </Paper>
  );
};

export default ProductDetails;
