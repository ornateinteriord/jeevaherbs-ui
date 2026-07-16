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

const WalletTransaction = () => {
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
        err?.response?.data?.message || "Failed to fetch Wallet transactions"
      );
    }
  }, [isError, error]);

  // Safely extract and filter transactions
  useEffect(() => {
    // Extract transactions from the response object
    const transactions = transactionsResponse?.data || [];
    
    console.log("Wallet Transactions Response:", transactionsResponse);
    console.log("Extracted transactions:", transactions);
    console.log("Is array?", Array.isArray(transactions));

    if (Array.isArray(transactions)) {
      // Filter out loan-related transactions - show everything EXCEPT loans
      const nonLoanTransactions = transactions.filter((tx: any) => {
        const transactionType = tx.transaction_type?.toLowerCase() || '';
        const description = tx.description?.toLowerCase() || '';
        const benefitType = tx.benefit_type?.toLowerCase() || '';
        
        return !(
          transactionType.includes('loan') ||
          description.includes('loan') ||
          transactionType.includes('repayment') ||
          description.includes('repayment') ||
          benefitType.includes('loan')
        );
      });

      console.log("Non-loan transactions:", nonLoanTransactions.length);

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchedData = nonLoanTransactions.filter((tx: any) =>
          Object.values(tx).some(value =>
            value?.toString().toLowerCase().includes(query)
          )
        );
        setFilteredData(searchedData);
      } else {
        setFilteredData(nonLoanTransactions);
      }
    } else {
      setFilteredData([]);
    }
  }, [transactionsResponse, searchQuery]);

  const noDataComponent = (
    <Box sx={{ padding: "24px", textAlign: "center" }}>
      <Typography variant="h6" color="textSecondary">
        No wallet transactions available
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
            Wallet Transactions
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
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  width: "100%", 
                  p: 1,
                }}>
                  <Typography variant="body2" color="textSecondary">
                    Showing {filteredData.length} wallet transactions
                  </Typography>
                  <TextField
                    placeholder="Search wallet transactions..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: '250px' }}
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

export default WalletTransaction;