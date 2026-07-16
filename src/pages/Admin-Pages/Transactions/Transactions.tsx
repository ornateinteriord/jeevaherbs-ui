import DataTable from "react-data-table-component";
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import './Transactions.scss'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DASHBOARD_CUTSOM_STYLE,
  getAdminPageTransactionColumns,
} from "../../../utils/DataTableColumnsProvider";
import { MuiDatePicker } from "../../../components/common/DateFilterComponent";
import { useGetAllTransactionDetails } from "../../../api/Admin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSearch from "../../../hooks/SearchQuery";

const Transactions = () => {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useGetAllTransactionDetails();
  useEffect(() => {
    if (isError) {
      const err = error as any;
      toast.error(
        err?.response.data.message || "Failed to fetch Transaction details"
      );
    }
  }, [isError, error]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transactions)
  
  return (
    <TransactionDataTable
      title="Transactions"
      summaryTitle="List of Transactions"
      data={filteredData}
      columns={getAdminPageTransactionColumns()}
      isLoading={isLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
};

export default Transactions;


export const TransactionDataTable = ({
  title,
  summaryTitle,
  data,
  columns,
  isLoading,
  searchQuery,
  setSearchQuery,
}: {
  title: string;
  summaryTitle: string;
  data: any;
  columns: any;
  isLoading?: boolean;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>> ;
}) => {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  return (
    <>
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="transaction-container"
        sx={{ margin: "2rem", mt: 12 }}
      >
        <Typography variant="h4">{title}</Typography>
        <Grid  className="transaction-content">
          <TextField
            size="small"
            placeholder="Member Id"
            className="member-id"
          />
          <MuiDatePicker date={fromDate} setDate={setFromDate} label="From Date" />
          <MuiDatePicker date={toDate} setDate={setToDate} label="To Date" />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2c8786",
              "&:hover": { backgroundColor: "#2c8786" },
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Card sx={{ margin: "2rem", mt: 2 }}>
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
              {summaryTitle}
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search..."
                  sx={{ minWidth: 200 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                />
              </div>
              <DataTable
                columns={columns}
                data={data}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                progressPending={isLoading}
                progressComponent={
                  <CircularProgress size={"4rem"} sx={{ color: "#2c8786" }}/>
                }
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};
