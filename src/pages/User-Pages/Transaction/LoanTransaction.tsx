import DataTable from "react-data-table-component";
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DASHBOARD_CUTSOM_STYLE,
  getTransactionColumns,
} from "../../../utils/DataTableColumnsProvider";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetTransactionDetails } from "../../../api/Memeber";

const LoanTransaction = () => {
  const {
    data: transactionsResponse,
    isLoading,
    isError,
    error,
  } = useGetTransactionDetails();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (isError) {
      const err = error as any;
      toast.error(
        err?.response?.data?.message || "Failed to fetch Loan transactions"
      );
    }
  }, [isError, error]);

  // Safely extract and filter transactions
  useEffect(() => {
    // Extract transactions from the response object
    const transactions = transactionsResponse?.data || [];
    
    console.log("Loan Transactions Response:", transactionsResponse);
    console.log("Extracted transactions:", transactions);
    console.log("Is array?", Array.isArray(transactions));

    if (Array.isArray(transactions)) {
      // Filter only loan-related transactions EXCEPT "Approved" status
      const loanTransactions = transactions.filter((tx: any) => {
        const transactionType = tx.transaction_type?.toLowerCase() || '';
        const description = tx.description?.toLowerCase() || '';
        const benefitType = tx.benefit_type?.toLowerCase() || '';
        const status = tx.status?.toLowerCase() || '';
        
        // Check if it's a loan transaction but NOT "Approved" status
        const isLoanTransaction = (
          transactionType.includes('loan') ||
          description.includes('loan') ||
          transactionType.includes('repayment') ||
          description.includes('repayment') ||
          benefitType.includes('loan')
        );
        
        // Exclude transactions with "Approved" status
        const isNotApproved = status !== 'approved';
        
        return isLoanTransaction && isNotApproved;
      });

      console.log("Loan transactions found (excluding Approved):", loanTransactions.length);

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchedData = loanTransactions.filter((tx: any) =>
          Object.values(tx).some(value =>
            value?.toString().toLowerCase().includes(query)
          )
        );
        setFilteredData(searchedData);
      } else {
        setFilteredData(loanTransactions);
      }
    } else {
      setFilteredData([]);
    }
  }, [transactionsResponse, searchQuery]);

  const noDataComponent = (
    <Box sx={{ padding: "24px", textAlign: "center" }}>
      <Typography variant="h6" color="textSecondary">
        No loan transactions available
      </Typography>
    </Box>
  );

  if (isLoading) {
    return (
      <Card sx={{ margin: "2rem", mt: 10, textAlign: "center", p: 3 }}>
        <CircularProgress size={"4rem"} sx={{ color: "#2c8786" }} />
      </Card>
    );
  }

  return (
    <Card sx={{ margin: "2rem", mt: 10 }}>
      <CardContent>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: "#2c8786",
              color: "#fff",
              "& .MuiSvgIcon-root": { color: "#fff" },
            }}
          >
            Loan Transactions ({filteredData.length})
          </AccordionSummary>
          <AccordionDetails>
            <DataTable
              columns={getTransactionColumns()}
              data={filteredData}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              progressPending={false}
              noDataComponent={noDataComponent}
              subHeader
              subHeaderComponent={
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  width: '100%', 
                  p: 1 
                }}>
                  <Typography variant="body2" color="textSecondary">
                    Showing {filteredData.length} loan transactions (excluding Approved status)
                  </Typography>
                  <TextField
                    placeholder="Search loan transactions..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 250 }}
                  />
                </Box>
              }
            />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LoanTransaction;