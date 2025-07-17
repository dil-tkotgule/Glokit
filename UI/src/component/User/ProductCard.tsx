// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import image from '../../../public/keyboard.png';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   Box,
// } from '@mui/material';

// interface ProductInterface {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
// }

// const ProductCard: React.FC<{ product: ProductInterface }> = ({ product }) => {
//   const [expanded, setExpanded] = useState(false);
//   const toggleDescription = () => setExpanded(!expanded);

//   const maxChars = 30;
//   const shouldTruncate = product.description.length > maxChars;
//   const shortText = product.description.slice(0, maxChars).trim();

//   return (
//     <Card
//       sx={{
//         width: '100%',
//         maxWidth: { xs: '100%', sm: 290, md: 240 },
//         margin: '0 auto',
//         display: 'flex',
//         flexDirection: 'column',
//         boxShadow: 2,
//         borderRadius: 2,
//         marginBottom:2,
//       }}
//     >
//       <CardMedia
//         component="img"
//         image={image}
//         alt="Product Image"
//         sx={{
//           objectFit: 'contain',
//           // padding: 1,
//           // width:'99%',
//           // height: { xs: 200, sm: 180, md: 160 },
//           height:'auto'
//         }}
//       />
//       <CardContent
//         sx={{
//           flexGrow: 1,
//           pb: '0.75rem !important',
//         }}
//       >
//         <Typography
//           variant="subtitle1"
//           component="h2"
//           sx={{
//             fontWeight: 600,
//             fontSize: { xs: '1rem', sm: '1.05rem' },
//             lineHeight: 1.3,
//           }}
//         >
//           {product.name}
//         </Typography>

//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             fontSize: { xs: '0.85rem', sm: '0.9rem' },
//             marginTop: '0.4rem',
//           }}
//         >
//           {expanded || !shouldTruncate ? (
//             <>
//               {product.description}{' '}
//               {shouldTruncate && (
//                 <Button
//                   variant="text"
//                   size="small"
//                   onClick={toggleDescription}
//                   sx={{ textTransform: 'none', padding: 0, minHeight: 0, minWidth: 0 }}
//                 >
//                   Read less
//                 </Button>
//               )}
//             </>
//           ) : (
//             <>
//               {shortText}...
//               <Button
//                 variant="text"
//                 size="small"
//                 onClick={toggleDescription}
//                 sx={{ textTransform: 'none', padding: 0, minHeight: 0, minWidth: 0 }}
//               >
//                 Read more
//               </Button>
//             </>
//           )}
//         </Typography>

//         <Button variant="contained" sx={{ mt: 1,width:'100%' }}>
//           Add
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;





import React, { useState } from 'react';
import image from '../../../public/tshirt.png';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
interface ProductInterface {
  product_id: string;
  product_name: string;
  product_description: string;
  product_quantity: number;
  category_name: string;
  product_category_id: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  image_url: string;
}

const ProductCard: React.FC<{ product: ProductInterface }> = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleDescription = () => setExpanded(!expanded);
  const maxChars = 30;
  const shouldTruncate = product.product_description.length > maxChars;
  const shortText = product.product_description.slice(0, maxChars).trim();

  return (
    <Card
      sx={{
        width: '95%',
        maxWidth: { xs: '100%', sm: 290, md: 240 },
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 2,
        borderRadius: 2,
        marginBottom: 2,
      }}
    >
      <CardMedia
        component="img"
        image={`http://localhost:3000/${product.image_url
          .substring(product.image_url.indexOf("uploads"))
          .replace(/\\/g, "/")}`}
        alt="Product Image"
        sx={{
          objectFit: 'contain',
          objectPosition: 'top',
          height: { xs: 200, sm: 180, md: 160 },
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          pb: '0.75rem !important',
        }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.05rem' },
            lineHeight: 1.3,
          }}
        >
          {product.product_name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            marginTop: '0.4rem',
          }}
        >
          {expanded || !shouldTruncate ? (
            <>
              {product.product_description}{' '}
              {shouldTruncate && (
                <Button
                  variant="text"
                  size="small"
                  onClick={toggleDescription}
                  sx={{ textTransform: 'none', padding: 0, minHeight: 0, minWidth: 0 }}
                >
                  Read less
                </Button>
              )}
            </>
          ) : (
            <>
              {shortText}...
              <Button
                variant="text"
                size="small"
                onClick={toggleDescription}
                sx={{ textTransform: 'none', padding: 0, minHeight: 0, minWidth: 0 }}
              >
                Read more
              </Button>
            </>
          )}
        </Typography>

        <Button variant="contained" sx={{ mt: 1, width: '100%' }}>
          Add
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
