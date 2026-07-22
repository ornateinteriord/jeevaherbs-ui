import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../../api/Api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataTable from "react-data-table-component";
import { DASHBOARD_CUTSOM_STYLE, getTransactionColumns } from "../../../utils/DataTableColumnsProvider";
import { useGetTransactionsByType } from "../../../api/Admin";

const DailyROI = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: roiTransactions, isLoading, refetch } = useGetTransactionsByType("Daily ROI");

  const filteredData = (roiTransactions || []).filter((tx: any) =>
    tx?.description !== "Initial ROI Setup" &&
    Object.values(tx).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleTriggerROI = async () => {
    setLoading(true);
    try {
      const response = await post("/user/trigger-roi", {});
      if (response && response.success) {
        toast.success(`Successfully processed! ${response.processedCount || 0} members received ROI.`);
        refetch();
      } else {
        toast.info(response?.message || "Trigger completed with no new updates.");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to trigger ROI";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const noDataComponent = (
    <Box sx={{ padding: "40px", textAlign: "center", color: "text.secondary" }}>
      <Typography variant="h6" gutterBottom>
        No Data Found
      </Typography>
      <Typography variant="body2">
        No daily ROI transaction data available to display.
      </Typography>
    </Box>
  );

  return (
    <>
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ margin: "2rem", mt: 12 }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: "1.2rem", md: "2.5rem" } }}>Daily ROI Management</Typography>
        <Button
          variant="contained"
          onClick={handleTriggerROI}
          disabled={loading}
          sx={{
            backgroundColor: "#2c8786",
            padding: "4px 12px",
            fontSize: { xs: "0.9rem", md: "1.3rem" },
            "&:hover": { backgroundColor: "#206463" },
            textTransform: "capitalize",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Trigger ROI"}
        </Button>
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
              List of Daily ROI Transactions
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
              <DataTable
                columns={getTransactionColumns()}
                data={filteredData}
                progressPending={isLoading}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
                noDataComponent={noDataComponent}
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

export default DailyROI;
