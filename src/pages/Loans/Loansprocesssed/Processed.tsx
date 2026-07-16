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
  Button,
  Chip,

} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { getProcessedLoansColumns } from '../../../utils/DataTableColumnsProvider';
import { MuiDatePicker } from '../../../components/common/DateFilterComponent';
import { useGetRewardLoansByStatus } from '../../../api/Admin';

export default function Processed() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const { data: processedData, isLoading: processedLoading } = useGetRewardLoansByStatus("Approved");

  const columns = getProcessedLoansColumns();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Safe data handling
  const loans = processedData?.loans || [];
  const totalCount = processedData?.totalCount || 0;

  // Simple pagination without sorting/filtering
  const paginatedData = loans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusChipColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderCellContent = (row: any, column: any) => {
    if (column.name === 'Status' && column.cell) {
      return column.cell(row);
    }
    return column.selector ? column.selector(row) : '-';
  };

  if (processedLoading) {
    return <Typography>Loading processed loans...</Typography>;
  }

  return (
    <>
      <Grid className="filter-container" sx={{ margin: '2rem', mt: 12 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Processed Loans
              </Typography>
            </Box>
          </Box>
        </Box>
        <Grid className="filter-actions" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <MuiDatePicker date={fromDate} setDate={setFromDate} label="From Date" />
          <MuiDatePicker date={toDate} setDate={setToDate} label="To Date" />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2c8786',
              '&:hover': { backgroundColor: '#2c8786' }
            }}
          >
            Search
          </Button>
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
              List of Processed Loans (Total: {totalCount})
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  sx={{ minWidth: 200 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                      paginatedData.map((row: any) => (
                        <TableRow 
                          key={row.id || row._id}
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                            '&:hover': { backgroundColor: 'action.selected' }
                          }}
                        >
                          {columns.map((column) => (
                            <TableCell key={`${row.id || row._id}-${column.name}`}>
                              {column.name === 'Status' ? (
                                <Chip 
                                  label={row.status} 
                                  color={getStatusChipColor(row.status)}
                                  size="small"
                                />
                              ) : (
                                renderCellContent(row, column)
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center">
                          No processed loans found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={loans.length} // Use loans.length instead of processedData.length
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