import React from 'react';
import ProductCard from './ProductCard';
import { Box, Button } from '@mui/material';

interface ProductInterface {
  productId: number;
  name: string;
  description: string;
  categoryName: string;
  imageUrl:string
}

const products = [
  {
    id: 1,
    name: "Waterproof Jacket",
    description: "Breathable and lightweight jacket with a hood, perfect for rainy weather.",
    category: "Clothing",
  },
  {
    id: 2,
    name: "Wireless Charging Pad",
    description: "Fast wireless charger compatible with iPhone, Samsung, and other Qi-enabled devices.",
    category: "Electronic",
  },
  {
    id: 3,
    name: "Stainless Steel Mug",
    description: "Vacuum insulated mug that keeps beverages hot for 8 hours or cold for 12.",
    category: "Bottle & Cups",
  },
  {
    id: 4,
    name: "Smart Fitness Tracker",
    description: "Tracks heart rate, steps, sleep, and syncs with your phone via Bluetooth.",
    category: "Electronic",
  },
  {
    id: 5,
    name: "Premium Notebook Set",
    description: "Hardcover notebook with smooth acid-free paper, perfect for journaling and note-taking.",
    category: "Stationery",
  },
    {
    id: 6,
    name: "Waterproof Jacket",
    description: "Breathable and lightweight jacket with a hood, perfect for rainy weather.",
    category: "Clothing",
  },
  {
    id: 7,
    name: "Wireless Charging Pad",
    description: "Fast wireless charger compatible with iPhone, Samsung, and other Qi-enabled devices.",
    category: "Electronic",
  },
  {
    id: 8,
    name: "Stainless Steel Mug",
    description: "Vacuum insulated mug that keeps beverages hot for 8 hours or cold for 12.",
    category: "Bottle & Cups",
  },
  {
    id: 9,
    name: "Smart Fitness Tracker",
    description: "Tracks heart rate, steps, sleep, and syncs with your phone via Bluetooth.",
    category: "Electronic",
  },
  {
    id: 10,
    name: "Premium Notebook Set",
    description: "Hardcover notebook with smooth acid-free paper, perfect for journaling and note-taking.",
    category: "Stationery",
  },
];

interface ProductPageProp{
  products:ProductInterface[]
}
const ProductPage: React.FC<ProductPageProp> = ({products}) => {
  return (
    <Box sx={{ width: '100%', px: 0, maxWidth: 1200, mx: 'auto' }}>
      <Box
        sx={{
          height: '80vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            width: 1,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 3,
          },
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: 0,
          marginTop: 2,
        }}
      >
        {products.map((product) => (
          <Box
            key={product.productId}
            sx={{
              flexBasis: {
                xs: '100%',    // 1 per row on xs
                sm: '50%',     // 2 per row on sm
                md: '33.33%',  // 3 per row on md
                lg: '25%',     // 4 per row on lg
              },
              maxWidth: {
                xs: '100%',
                sm: '50%',
                md: '33.33%',
                lg: '25%',
              },
              display: 'flex',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
          px: 2,
        }}
      >
        <Button variant="contained">Placed Order</Button>
      </Box>
    </Box>
  );
};

export default ProductPage;
