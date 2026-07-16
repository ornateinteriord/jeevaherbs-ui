import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { getPendingLoansColumns } from '../../../utils/DataTableColumnsProvider';
import { MuiDatePicker } from '../../../components/common/DateFilterComponent';
import { useGetRewardLoansByStatus, useUpdateRewardLoanStatus } from '../../../api/Admin';
import { toast } from 'react-toastify';

export default function PendingLoans() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const { 
    data: pendingLoansData, 
    isLoading, 
    error,
    refetch 
  } = useGetRewardLoansByStatus("Processing");
  console.log("processing loan:", pendingLoansData);

  const updateLoanMutation = useUpdateRewardLoanStatus();

  const pendingLoans = pendingLoansData?.loans || [];
  const totalCount = pendingLoansData?.totalCount || 0;

  const handleProcessLoan = async (memberId: string, action: 'approve' | 'reject') => {
    try {
      await updateLoanMutation.mutateAsync({ 
        memberId, 
        action 
      });
      toast.success(`Loan ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      refetch();
    } catch (err) {
      console.error('Error processing loan:', err);
    }
  };

  const columns = getPendingLoansColumns(handleProcessLoan);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = pendingLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderCellContent = (row: any, column: any) => {
    if (column.cell) {
      return column.cell(row);
    }
    
    if (column.selector) {
      const value = column.selector(row);
      
      if (column.name === 'Loan Amount') {
        return `₹${(value || 0).toLocaleString()}`;
      }
      
      return value || '-';
    }
    
    return '-';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ margin: '2rem', mt: 12 }}>
        <Typography color="error">
          Error loading pending loans
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid className="filter-container" sx={{ margin: '2rem', mt: 12 }}>
        <Typography variant="h4">
          Pending Loans
        </Typography>
        <Grid className="filter-actions" sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <MuiDatePicker date={fromDate} setDate={setFromDate} label="From Date" />
          <MuiDatePicker date={toDate} setDate={setToDate} label="To Date" />
        </Grid>
      </Grid>

      <Card sx={{ margin: '2rem', mt: 2 }}>
        <CardContent>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#2c8786',
                color: '#fff',
                '& .MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              <Typography variant="h6">
                List of Pending Loans ({totalCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  sx={{ minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2c8786' }}>
                      {columns.map((column) => (
                        <TableCell 
                          key={column.name}
                          sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          {column.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row:any) => (
                        <TableRow 
                          key={row._id}
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                            '&:hover': { backgroundColor: 'action.selected' }
                          }}
                        >
                          {columns.map((column) => (
                            <TableCell key={`${row._id}-${column.name}`}>
                              {renderCellContent(row, column)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          No pending loans found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pendingLoans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}