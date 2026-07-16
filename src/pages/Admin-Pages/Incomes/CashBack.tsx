import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MuiDatePicker } from "../../../components/common/DateFilterComponent";
import './CashBack.scss'
import DataTable from "react-data-table-component";
import { DASHBOARD_CUTSOM_STYLE, getCashBackColumns } from "../../../utils/DataTableColumnsProvider";
import { useState } from "react";

const CashBack = () => {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Empty data array for demonstration
  const data: any[] = [];
  
  const noDataComponent = (
    <Box sx={{ 
      padding: "40px", 
      textAlign: "center",
      color: "text.secondary"
    }}>
      <Typography variant="h6" gutterBottom>
        No Data Found
      </Typography>
      <Typography variant="body2">
        No daily benefits data available to display.
      </Typography>
    </Box>
  );

  return (
    <>
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="Cashback-container"
        sx={{ margin: "2rem", mt: 12 }}
      >
        <Typography variant="h4">Daily Benefits</Typography>
        <Grid className="Cashback-content">
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
              List of Daily Benefits Payouts
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
                columns={getCashBackColumns()}
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
  )
}

export default CashBack