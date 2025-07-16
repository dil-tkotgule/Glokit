// src/component/ProductTable.tsx

import React from "react";
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export interface IProductUI {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number;
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

  const renderSortButton = (field: keyof IProductUI, label: string) => (
    <Button
      onClick={() => onSort(field)}
      sx={{
        textTransform: "none",
        color: "text.primary",
        fontWeight: 600,
        minWidth: "auto",
        padding: "4px 8px",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
      endIcon={
        sortField === field ? (
          sortOrder === "asc" ? (
            <ArrowUpward fontSize="small" />
          ) : (
            <ArrowDownward fontSize="small" />
          )
        ) : undefined
      }
    >
      {label}
    </Button>
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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
      <Avatar
        src={imageUrl}
        alt={product.product_name}
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          border: "2px solid",
          borderColor: "grey.300",
        }}
      />
    );
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: "100%", 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Table Container - Takes remaining space */}
      <TableContainer sx={{ 
        flex: 1, 
        overflow: "auto",
        minHeight: 0 // Important for flex child to shrink
      }}>
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 700,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  width: "25%",
                }}
              >
                {renderSortButton("product_name", "Product Name")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 700,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  width: "10%",
                  textAlign: "center",
                }}
              >
                Image
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 700,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  width: "30%",
                }}
              >
                {renderSortButton("product_description", "Description")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 700,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  width: "12%",
                }}
              >
                {renderSortButton("product_price", "Quantity")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 700,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  width: "13%",
                }}
              >
                {renderSortButton("category_name", "Category")}
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 700,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  width: "10%",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.product_id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "action.hover",
                    },
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.4,
                      }}
                    >
                      {product.product_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {renderProductImage(product)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={product.product_description} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.4,
                        }}
                      >
                        {truncateText(product.product_description)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "success.main",
                        fontSize: "1rem",
                      }}
                    >
                      {formatPrice(product.product_price).substring(1,formatPrice(product.product_price).indexOf('.'))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category_name}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit Product" arrow>
                        <IconButton
                          component={Link}
                          to={`/product/update/${product.product_id}`}
                          size="small"
                          sx={{
                            color: "primary.main",
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.contrastText",
                            },
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
                            "&:hover": {
                              backgroundColor: "error.light",
                              color: "error.contrastText",
                            },
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
                    <ImageIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
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
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: theme.palette.grey[50],
          flexShrink: 0, // Prevent pagination from shrinking
          minHeight: 42, // Ensure minimum height
        }}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />
    </Paper>
  );
};

export default ProductTable;