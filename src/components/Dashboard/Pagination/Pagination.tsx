// src/components/Dashboard/Pagination.tsx
import React from "react";
import { Pagination as MuiPagination, PaginationProps } from "@mui/material";

const apiGatewayUrl = '';  // API Gateway URL


interface CustomPaginationProps extends PaginationProps {
  count: number; // Total number of pages
  onPageChange: (page: number) => void; // Function to handle page changes
}

const Pagination: React.FC<CustomPaginationProps> = ({ count, onPageChange, ...props }) => {
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  return (
    <MuiPagination
      count={count}
      onChange={handleChange}
      {...props} // Pass any additional props
    />
  );
};

export default Pagination;
