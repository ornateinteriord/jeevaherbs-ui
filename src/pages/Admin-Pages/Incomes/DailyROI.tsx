import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Grid, Typography, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../../api/Api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataTable from "react-data-table-component";
import { DASHBOARD_CUTSOM_STYLE, getTransactionColumns } from "../../../utils/DataTableColumnsProvider";

const DailyROI = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Empty data array for demonstration; connect to API as needed
  const data: any[] = [];

  const handleTriggerROI = async () => {
    setLoading(true);
    try {
      const response = await post("/user/trigger-roi", {});
      if (response && response.success) {
        toast.success(`Successfully processed! ${response.processedCount || 0} members received ROI.`);
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
        <Typography variant="h4">Daily ROI Management</Typography>
        <Button
          variant="contained"
          onClick={handleTriggerROI}
          disabled={loading}
          sx={{
            backgroundColor: "#2c8786",
            padding: "8px 24px",
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#206463" },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Trigger Daily ROI Now"}
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
                data={data}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
                noDataComponent={noDataComponent}
                subHeader
                subHeaderComponent={
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    width: "100%",
                    p: 1
                  }}>
                    <Typography variant="body2" color="textSecondary">
                      {data.length === 0 ? "No records found" : `Showing ${data.length} records`}
                    </Typography>
                  </Box>
                }
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

export default DailyROI;
