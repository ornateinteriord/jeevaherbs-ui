import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataTable from "react-data-table-component";
import {
  DASHBOARD_CUTSOM_STYLE,
  getAdminLevelBenifitsColumns,

} from "../../../utils/DataTableColumnsProvider";
import { useGetAllTransactionDetails } from '../../../api/Admin';

const LevelBenifits = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use the same transaction hook and filter for level benefits
  const { data: allTransactions, isLoading, isError } = useGetAllTransactionDetails();

  // Filter transactions to get only level benefits
  const levelBenefits = allTransactions?.filter((transaction: any) => 
    transaction.type === 'level_benefit' || 
    transaction.transactionType === 'level' ||
    transaction.category === 'level_benefits' ||
    // Add other conditions that identify level benefits in your data
    transaction.description?.toLowerCase().includes('level')
  ) || [];

  const filteredData = levelBenefits?.filter((benefit: any) =>
    Object.values(benefit).some(
      value => 
        value && 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const noDataComponent = (
    <div style={{ padding: "24px" }}>
      {isError ? "Error loading data" : "No data available in table"}
    </div>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" sx={{ margin: "2rem", mt: 10 }}>
        Level Benefits
      </Typography>
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
              List of Level Benefits
            </AccordionSummary>
            <AccordionDetails>
              <Box
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 200 }}
                />
              </Box>
              <DataTable
                columns={getAdminLevelBenifitsColumns()}
                data={filteredData}
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

export default LevelBenifits;