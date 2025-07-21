// src/component/ProductTable.tsx

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TablePagination,
  Avatar,
  Typography,
  Box,
  Chip,
  Tooltip,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  Image as ImageIcon,
  Warning as WarningIcon,
  UnfoldMore as UnfoldMoreIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ImagePopup from "./ImagePopup";

export interface IProductUI {
  product_id: string;
  product_name: string;
  product_description: string;
  product_quantity: number;
  category_name: string;
  image_url: string;
}

interface ProductTableProps {
  products: IProductUI[];
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortField: keyof IProductUI | "";
  sortOrder: "asc" | "desc";
  onSort: (field: keyof IProductUI) => void;
  onDelete: (id: string) => void;
  deleteLoading?: string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  sortField,
  sortOrder,
  onSort,
  onDelete,
  deleteLoading,
}) => {
  const theme = useTheme();
  const [imagePopup, setImagePopup] = useState<{
    open: boolean;
    productId: string;
    productName: string;
    imageUrl?: string;
  }>({
    open: false,
    productId: "",
    productName: "",
    imageUrl: "",
  });

  const handleImageClick = (product: IProductUI) => {
    setImagePopup({
      open: true,
      productId: product.product_id,
      productName: product.product_name,
      imageUrl: product.image_url,
    });
  };

  const handleCloseImagePopup = () => {
    setImagePopup({
      open: false,
      productId: "",
      productName: "",
      imageUrl: "",
    });
  };

  const renderSortButton = (field: keyof IProductUI, label: string) => (
    <Button
      onClick={() => onSort(field)}
      sx={{
        textTransform: "none",
        color: "primary.contrastText",
        fontWeight: 600,
        minWidth: "auto",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        "&:hover": {
          backgroundColor: "primary.dark",
        },
      }}
      endIcon={
        sortField === field ? (
          sortOrder === "asc" ? (
            <ArrowUpward fontSize="small" sx={{ color: "primary.contrastText" }} />
          ) : (
            <ArrowDownward fontSize="small" sx={{ color: "primary.contrastText" }} />
          )
        ) : (
          <UnfoldMoreIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
        )
      }
    >
      {label}
    </Button>
  );

  const formatquantity = (quantity: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(quantity);
  };

  const renderQuantityWithIndicator = (quantity: number) => {
    const isLowStock = quantity < 10;
    const formattedQuantity = formatquantity(quantity).substring(1, formatquantity(quantity).indexOf('.'));
    
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isLowStock ? "warning.main" : "success.main",
            fontSize: "1rem",
          }}
        >
          {formattedQuantity}
        </Typography>
        {isLowStock && (
          <Tooltip title="Low stock warning" arrow>
            <WarningIcon 
              fontSize="small" 
              sx={{ 
                color: "warning.main",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }} 
            />
          </Tooltip>
        )}
      </Box>
    );
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderProductImage = (product: IProductUI) => {
    if (!product.image_url || product.image_url.length === 0) {
      return (
        <Avatar
          sx={{
            width: 64,
            height: 64,
            backgroundColor: "grey.200",
            color: "grey.500",
          }}
        >
          <ImageIcon />
        </Avatar>
      );
    }

    const imageUrl = product.image_url.includes("uploads")
      ? `http://localhost:3000/${product.image_url
          .substring(product.image_url.indexOf("uploads"))
          .replace(/\\/g, "/")}`
      : product.image_url;

    return (
      <Tooltip title="Click to view larger image" arrow>
        <Avatar
          src={imageUrl}
          alt={product.product_name}
          onClick={() => handleImageClick(product)}
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            border: "2px solid",
            borderColor: "grey.300",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              borderColor: "primary.main",
              boxShadow: theme.shadows[4],
            },
          }}
        />
      </Tooltip>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: "100%", 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      {/* Table Container - Takes remaining space */}
      <TableContainer sx={{ 
        flex: 1, 
        overflow: "auto",
        minHeight: 0, // Important for flex child to shrink
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "grey.100",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "grey.400",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "grey.500",
          },
        },
      }}>
        <Table stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderBottom: "none",
                  width: "25%",
                  py: 2,
                }}
              >
                {renderSortButton("product_name", "Product Name")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderBottom: "none",
                  width: "10%",
                  textAlign: "center",
                  py: 2,
                }}
              >
                Image
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderBottom: "none",
                  width: "30%",
                  py: 2,
                }}
              >
                {renderSortButton("product_description", "Description")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderBottom: "none",
                  width: "15%",
                  py: 2,
                }}
              >
                {renderSortButton("product_quantity", "Quantity")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderBottom: "none",
                  width: "10%",
                  py: 2,
                }}
              >
                {renderSortButton("category_name", "Category")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderBottom: "none",
                  width: "10%",
                  textAlign: "center",
                  py: 2,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow
                  key={product.product_id}
                  hover
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "grey.50",
                    },
                    "&:hover": {
                      backgroundColor: "primary.light",
                      "& .MuiTableCell-root": {
                        color: "primary.contrastText",
                      },
                      "& .MuiChip-root": {
                        backgroundColor: "primary.contrastText",
                        color: "primary.main",
                      },
                    },
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <TableCell sx={{ py: 2, px: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.4,
                        fontSize: "0.95rem",
                      }}
                    >
                      {product.product_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2, px: 3 }}>
                    {renderProductImage(product)}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 3 }}>
                    <Tooltip title={product.product_description} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.4,
                          fontSize: "0.9rem",
                        }}
                      >
                        {truncateText(product.product_description)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 3 }}>
                    {renderQuantityWithIndicator(product.product_quantity)}
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 3 }}>
                    <Chip
                      label={product.category_name}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderRadius: 3,
                        fontSize: "0.8rem",
                        height: 28,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2, px: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit Product" arrow>
                        <IconButton
                          component={Link}
                          to={`/product/update/${product.product_id}`}
                          size="small"
                          sx={{
                            color: "info.main",
                            backgroundColor: "",
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "info.contrastText",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product" arrow>
                        <IconButton
                          onClick={() => onDelete(product.product_id)}
                          size="small"
                          disabled={deleteLoading === product.product_id}
                          sx={{
                            color: "error.main",
                            backgroundColor: "",
                            "&:hover": {
                              backgroundColor: "error.main",
                              color: "error.contrastText",
                              transform: "scale(1.1)",
                            },
                            "&:disabled": {
                              backgroundColor: "grey.200",
                              color: "grey.500",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          {deleteLoading === product.product_id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <ImageIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination - Fixed at bottom */}
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          alignItems: "center",
          borderTop: 2,
          borderColor: "primary.main",
          backgroundColor: "primary.light",
          color: "primary.contrastText",
          flexShrink: 0, // Prevent pagination from shrinking
          minHeight: 52, // Ensure minimum height
          textAlign: "center",
          "& .MuiTablePagination-toolbar": {
            px: 3,
            py: 1.5,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            color: "primary.contrastText",
            fontWeight: 500,
          },
          "& .MuiSelect-select": {
            color: "primary.contrastText",
            // marginBottom: "20px",
            
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            paddingTop: "12px",
          },
          // "& .MuiInputBase-root": {
          //   color: "primary.contrastText",
          //   marginTop: "0px",
          //   // boxSizing: "border-box",
          //   // display: "flex",
          //   alignItems: "flex-start",
          //   textAlign: "top",
          // },
          "& .MuiIconButton-root": {
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.main",
            },
            "&.Mui-disabled": {
              color: "primary.light",
            },
          },
        }}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
      
      {/* Image Popup Modal */}
      <ImagePopup
        open={imagePopup.open}
        onClose={handleCloseImagePopup}
        productId={imagePopup.productId}
        productName={imagePopup.productName}
        initialImageUrl={imagePopup.imageUrl}
      />
    </Paper>
  );
};

export default ProductTable;