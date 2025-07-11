
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
}) => {
  const renderSortButton = (field: keyof IProductUI, label: string) => (
    <Button onClick={() => onSort(field)} sx={{ textTransform: "none" , color:'black' }}>
      {label} {sortField === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
    </Button>
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>{renderSortButton("product_name", "Name")}</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>{renderSortButton("product_description", "Description")}</TableCell>
            <TableCell>{renderSortButton("product_price", "Price")}</TableCell>
            <TableCell>{renderSortButton("category_name", "Category")}</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_name}</TableCell>
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
                <TableCell>{product.product_description}</TableCell>
                <TableCell>{product.product_price}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/product/update/${product.product_id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(product.product_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
};

export default ProductTable;
