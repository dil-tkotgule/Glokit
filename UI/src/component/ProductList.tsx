import React, { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";

interface IProductUI {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  category_name: string;
  product_category_id: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  image_url: string;
}

const BACKEND_URL = "http://localhost:3000"; // Adjust if needed

const ProductList = () => {
  // Track open state for each row by product_id
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});
  const [products, setProducts] = useState<IProductUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Search and filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Sorting
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof IProductUI | "">("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/app/product/list"
      );
      const data = response.data.data;
      const uniqueProductIds = new Set<number>();
      const processedData = data.filter((item: IProductUI) => {
        if (uniqueProductIds.has(item.product_id)) {
          return false; // Skip duplicates
        }
        uniqueProductIds.add(item.product_id);
        return true;
      });
      setProducts(processedData);
      // Extract unique category names for filter dropdown
      const uniqueCategories = Array.from(
        new Set(data.map((p: IProductUI) => p.category_name || ""))
      );
      setCategories(uniqueCategories.filter(Boolean) as string[]);
    } catch (err) {
      if (err) {
        setError((err as Error).message);
      } else {
        setError("Error fetching data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering and searching
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? product.category_name === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic for all fields except image and action
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  // Pagination logic
  const paginatedProducts = sortedProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  async function handleDelete(product_id: string) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/app/product/soft-delete/${product_id}`
      );
      if (response.status === 200) {
        setProducts(
          products.filter((product) => product.product_id !== product_id)
        );
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Box
      sx={{
        mt: 1,
        width: "90%",
        margin: "auto",
        fontSize: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Typography variant="h5" sx={{ p: 2 }}>
        Product List
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ background: "#fff", borderRadius: 1, minWidth: 220 }}
        />
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 180,
            fontSize: "2rem",
            background: "#fff",
            borderRadius: 1,
          }}
        >
          <InputLabel>Filter by Category</InputLabel>
          <Select
            label="Filter by Category"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table style={{ minWidth: 650, fontSize: "2rem" }}>
          <TableHead style={{ backgroundColor: "#A2D5C6" }}>
            <TableRow>
              <TableCell>
                <Button
                  size="small"
                  variant="text"
                  disableRipple
                  onClick={() => {
                    setSortField("product_name");
                    setSortOrder(
                      sortField === "product_name" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                  sx={{
                    ml: 1,
                    minWidth: 0,
                    padding: 0,
                    color: "black",
                    boxShadow: "none",
                    border: "none",
                    background: "none",
                    "&:focus": { outline: "none" },
                  }}
                >
                  Name{" "}
                  {sortField === "product_name"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="text"
                  disableRipple
                  onClick={() => {
                    setSortField("product_description");
                    setSortOrder(
                      sortField === "product_description" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                  sx={{
                    ml: 1,
                    minWidth: 0,
                    padding: 0,
                    color: "black",
                    boxShadow: "none",
                    border: "none",
                    background: "none",
                    "&:focus": { outline: "none" },
                  }}
                >
                  Description{" "}
                  {sortField === "product_description"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="text"
                  disableRipple
                  onClick={() => {
                    setSortField("product_price");
                    setSortOrder(
                      sortField === "product_price" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                  sx={{
                    ml: 1,
                    minWidth: 0,
                    padding: 0,
                    color: "black",
                    boxShadow: "none",
                    border: "none",
                    background: "none",
                    "&:focus": { outline: "none" },
                  }}
                >
                  Quantity{" "}
                  {sortField === "product_price"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="text"
                  disableRipple
                  onClick={() => {
                    setSortField("category_name");
                    setSortOrder(
                      sortField === "category_name" && sortOrder === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                  sx={{
                    ml: 1,
                    minWidth: 0,
                    padding: 0,
                    color: "black",
                    boxShadow: "none",
                    border: "none",
                    background: "none",
                    "&:focus": { outline: "none" },
                  }}
                >
                  Category{" "}
                  {sortField === "category_name"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </Button>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: IProductUI) => (
                <React.Fragment key={product.product_id}>
                  <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.product_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {product.image_url && product.image_url.length > 0 ? (
                        <img
                          src={
                            product.image_url.includes("uploads")
                              ? `http://localhost:3000/${product.image_url
                                  .substring(
                                    product.image_url.indexOf("uploads")
                                  )
                                  .replace(/\\/g, "/")}`
                              : product.image_url
                          }
                          alt={product.product_name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#aaa" }}>No Image</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.product_description}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.product_price}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.category_name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/product/update/${product.product_id}`}
                        size="small"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.product_id)}
                        size="small"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
};

export default ProductList;
