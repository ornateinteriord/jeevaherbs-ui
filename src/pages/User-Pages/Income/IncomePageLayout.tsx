import React, { useEffect, useState } from "react";
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
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DASHBOARD_CUTSOM_STYLE,
  getTransactionColumns,
} from "../../../utils/DataTableColumnsProvider";
import { toast } from "react-toastify";
import { useGetTransactionDetails } from "../../../api/Memeber";
import DashboardCard from "../../../components/common/DashboardCard";

interface IncomePageLayoutProps {
  title: string;
  balanceLabel: string;
  amount: string | number;
  filterTypes: string[]; // e.g., ["Daily ROI"]
}

const IncomePageLayout: React.FC<IncomePageLayoutProps> = ({ title, balanceLabel, amount, filterTypes }) => {
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
        err?.response?.data?.message || `Failed to fetch ${title} transactions`
      );
    }
  }, [isError, error, title]);

  useEffect(() => {
    const transactions = transactionsResponse?.data || [];

    if (Array.isArray(transactions)) {
      let specificTransactions = transactions;
      
      if (filterTypes.length > 0) {
        specificTransactions = transactions.filter((tx: any) => {
          if (tx?.description === "Initial ROI Setup") return false;
          const type = tx.transaction_type?.toLowerCase().trim() || '';
          const desc = tx.description?.toLowerCase().trim() || '';
          
          return filterTypes.some(filter => {
            const f = filter.toLowerCase().trim();
            return type === f || desc === f;
          });
        });
      }

      if (searchQuery) {
        const searchedData = specificTransactions.filter((tx: any) =>
          Object.values(tx).some(
            (val) =>
              val &&
              val.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setFilteredData(searchedData);
      } else {
        setFilteredData(specificTransactions);
      }
    }
  }, [transactionsResponse, searchQuery, filterTypes]);

  return (
    <Box sx={{ pb: 5, margin: "2rem", mt: 10 }}>
      {/* Top Card Section */}
      <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard amount={amount} title={balanceLabel} />
        </Grid>
      </Grid>

      {/* Table Section */}
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ padding: "0 !important" }}>
          <Accordion defaultExpanded elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
                padding: "0 24px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c8786" }}>
                {title} Transactions
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "24px" }}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress sx={{ color: "#2c8786" }} />
                </Box>
              ) : (
                <Box>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder={`Search ${title.toLowerCase()} transactions...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2, width: { xs: "100%", sm: "300px" } }}
                  />
                  <DataTable
                    columns={getTransactionColumns()}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    customStyles={DASHBOARD_CUTSOM_STYLE}
                    responsive
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IncomePageLayout;
