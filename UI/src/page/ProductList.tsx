// src/pages/ProductList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Stack,
  Button,
  Card,
  Paper,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import ProductTable, { type IProductUI } from "../component/ProductTable";
import { useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProductUI[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState<keyof IProductUI | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/app/product/list");
        const data = response.data.data;

        const uniqueProducts = data.filter(
          (item: IProductUI, index: number, self: IProductUI[]) =>
            index === self.findIndex((p) => p.product_id === item.product_id)
        );

        setProducts(uniqueProducts);

        const uniqueCategories = Array.from(
          new Set(uniqueProducts.map((p) => p.category_name).filter(Boolean))
        );
        setCategories(uniqueCategories);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      await axios.delete(`http://localhost:3000/app/product/soft-delete/${id}`);
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
    } catch (err: any) {
      setError(err.message || "Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSort = (field: keyof IProductUI) => {
    setSortOrder((prev) => (sortField === field && prev === "asc" ? "desc" : "asc"));
    setSortField(field);
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter ? product.category_name === categoryFilter : true)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const hasActiveFilters = search || categoryFilter;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: "100%" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        p={2}
        bgcolor={'white'}
      >
        <Typography variant="h5" fontWeight="bold">
          Product List
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/create")}
        >
          Create Product
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search Products"
              fullWidth
              size="small"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
              }}
              placeholder="Search by product name..."
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
           <FormControl
  size="small"
  sx={{ minWidth: 240, width: "100%" }} // Wider minimum width
>
  <InputLabel>Category Filter</InputLabel>
  <Select
    value={categoryFilter}
    label="Category Filter"
    onChange={(e) => {
      setCategoryFilter(e.target.value as string);
      setPage(0);
    }}
  >
    <MenuItem value="">All Categories</MenuItem>
    {categories.map((category) => (
      <MenuItem key={category} value={category}>
        {category}
      </MenuItem>
    ))}
  </Select>
</FormControl>

          </Grid>

          <Grid item xs={12} md={4} display="flex" alignItems="center">
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {hasActiveFilters && (
                <Chip
                  label="Clear Filters"
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("");
                    setSortField("");
                    setSortOrder("asc");
                    setPage(0);
                  }}
                  onDelete={() => {
                    setSearch("");
                    setCategoryFilter("");
                    setSortField("");
                    setSortOrder("asc");
                    setPage(0);
                  }}
                />
              )}
              <Chip
                label={`${sortedProducts.length} Product${
                  sortedProducts.length !== 1 ? "s" : ""
                }`}
                color="primary"
                size="small"
                variant="outlined"
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Product Table */}
      <Card sx={{ height: "100%", overflow: "hidden" }}>
        <ProductTable
          products={paginatedProducts}
          count={sortedProducts.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />
      </Card>
    </Box>
  );
};

export default ProductList;
