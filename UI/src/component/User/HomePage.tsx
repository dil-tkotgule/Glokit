// import FilterPanel from './FilterPanel'
// import ProductPage from './ProductPage' 
// import {Box} from '@mui/material'
// const categories = ["A","B","C"];

// const HomePage:React.FC = () =>{
//     return (
//         <Box
//   sx={{
//     display: 'flex',
//     flexDirection: { xs: 'column', md: 'row' }, 
//     gap: 2,                                   
//     px: { xs: 1, sm: 1, md: 2 },               
//     py: { xs: 2, sm: 3 },                    
//     bgcolor: 'background.default',             
//   }}
// >
//   <Box
//     sx={{
//       flexShrink: 0,
//       width: { xs: '100%', md: '200px' },        
//       mb: { xs: 2, md: 0 },          
//       p: 2,
//       bgcolor: 'grey.100',
//       borderRadius: 2,
//       boxShadow: { xs: 1, md: 0 },
//       position:'static'
//     }}
//   >
//     <FilterPanel categories={categories} />
//   </Box>

//   {/* Product Listing */}
//   <Box
//     sx={{
//     //   flexGrow: 1,
//       p: 1,
//       bgcolor: 'grey.50',
//       borderRadius: 2,
//     }}
//   >
//     <ProductPage />
//   </Box>
// </Box>

//     )
// }

// export default HomePage;


import React from 'react';
import FilterPanel from './FilterPanel';
import ProductPage from './ProductPage';
import { Box } from '@mui/material';

const categories = ["A", "B", "C"];

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        px: { xs: 1, sm: 1, md: 2 },
        py: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
        minHeight: '100vh', // optional, for full viewport height
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
          flexGrow: 1,  // important for this to fill remaining space on md+
          p: 1,
          bgcolor: 'grey.50',
          borderRadius: 2,
          minWidth: 0,   // helps with overflow in flex layouts
        }}
      >
        <ProductPage />
      </Box>
    </Box>
  );
};

export default HomePage;
