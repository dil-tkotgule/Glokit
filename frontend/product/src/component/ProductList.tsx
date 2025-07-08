import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Collapse,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link } from 'react-router-dom';

interface IProductUI {
  product_id: number;
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

const BACKEND_URL = 'http://localhost:3000'; // Adjust if needed

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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Sorting
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/app/product/list');
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
      const uniqueCategories = Array.from(new Set(data.map((p: IProductUI) => p.category_name || '')));
      setCategories(uniqueCategories.filter(Boolean) as string[]);
    } catch (err) {
      if (err) {
        setError((err as Error).message);
      } else {
        setError('Error fetching data');
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
    const matchesSearch = product.product_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? product.category_name === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Sorting by price
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return Number(a.product_price) - Number(b.product_price);
    } else {
      return Number(b.product_price) - Number(a.product_price);
    }
  });

  // Pagination logic
  const paginatedProducts = sortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleRow = (productId: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 1, width: '90%', margin: 'auto' , fontSize: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Product List
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180,  fontSize: '2rem' }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            label="Filter by Category"
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          sx={{ ml: 2, color: 'black', borderColor: 'black' }}
        >
          Sort by Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650, fontSize: '2rem' }}>
          <TableHead style={{ backgroundColor: '#A2D5C6' }}>
            <TableRow >
              <TableCell />
              <TableCell>Image</TableCell>
              <TableCell >Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                Price
                <Button
                  size="small"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  sx={{ ml: 1, minWidth: 0, padding: 0, color: 'black' }}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: IProductUI) => (
                <React.Fragment key={product.product_id}>
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleToggleRow(product.product_id)}
                      >
                        {openRows[product.product_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {product.image_url && product.image_url.length > 0 ? (
                        <img
                          src={
                            product.image_url.includes('uploads')
                              ? `http://localhost:3000/${product.image_url
                                  .substring(product.image_url.indexOf('uploads'))
                                  .replace(/\\/g, '/')}`
                              : product.image_url
                          }
                          alt={product.product_name}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                        />
                      ) : (
                        <span style={{ color: '#aaa' }}>No Image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {product.product_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {product.product_description}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        ${product.product_price}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {product.category_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product.product_id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="outlined" size="small">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={openRows[product.product_id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          
                          <Table size="small" aria-label="details">
                            <TableHead>
                              <TableRow>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Updated By</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {product.created_at ? new Date(product.created_at).toLocaleString() : ''}
                                </TableCell>
                                <TableCell>
                                  {product.updated_at ? new Date(product.updated_at).toLocaleString() : ''}
                                </TableCell>
                                <TableCell>
                                  {product.created_by || '-'}
                                </TableCell>
                                <TableCell>
                                  {product.updated_by || '-'}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
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

