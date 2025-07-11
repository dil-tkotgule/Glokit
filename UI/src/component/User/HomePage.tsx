
import React, { useState } from 'react';
import FilterPanel from './FilterPanel';
import ProductPage from './ProductPage';
import { Box } from '@mui/material';
import {useEffect } from 'react'

const categories = ["A", "B", "C"];
interface ProductInterface {
  productId: number;
  name: string;
  description: string;
  categoryName: string;
  imageUrl:string
}
const HomePage: React.FC = () => {
  const [products,setProducts] = useState<ProductInterface[]>([]);
  useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:3000/list');
                if (!response.ok) throw new Error('Failed to fetch products');
                const jsonData = await response.json();
                setProducts(jsonData.products);
            } catch (error) {
                console.error(error);
            }
           
        }
        fetchProducts();
    })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        px: { xs: 1, sm: 1, md: 2 },
        py: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
        minHeight: '100vh', 
      }}
    >
      {/* Sidebar FilterPanel */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: 200 },
          mb: { xs: 2, md: 0 },
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 2,
          boxShadow: { xs: 1, md: 0 },
          position: 'static',
        }}
      >
        <FilterPanel categories={categories} />
      </Box>

      {/* ProductPage container */}
      <Box
        sx={{
          flexGrow: 1, 
          p: 1,
          bgcolor: 'grey.50',
          borderRadius: 2,
          minWidth: 0, 
        }}
      >
        <ProductPage products={products} />
      </Box>
    </Box>
  );
};

export default HomePage;
