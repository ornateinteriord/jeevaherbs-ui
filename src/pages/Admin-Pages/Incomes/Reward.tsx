import { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataTable from "react-data-table-component";
import {
  DASHBOARD_CUTSOM_STYLE,
  getRewardColumns,
  formatMember
} from "../../../utils/DataTableColumnsProvider";
import { useGetTransactionsByType } from '../../../api/Admin';


const Reward = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: rewardTransactions, isLoading, isError } = useGetTransactionsByType("Reward");

  const groupedData = useMemo(() => {
    if (!rewardTransactions) return [];
    const groupMap = new Map();
    rewardTransactions.forEach((tx: any) => {
      const memberId = tx.member_id;
      if (!groupMap.has(memberId)) {
        groupMap.set(memberId, {
          member_id: memberId,
          Name: tx.Name || '',
          totalAmount: 0,
          transactions: []
        });
      }
      const group = groupMap.get(memberId);
      group.totalAmount += parseFloat(tx.ew_credit || 0);
      group.transactions.push(tx);
    });
    const groupedArray = Array.from(groupMap.values());
    
    // Sort by member_id ascending (e.g. JH0001, JH0002)
    groupedArray.sort((a: any, b: any) => {
      if (a.member_id < b.member_id) return -1;
      if (a.member_id > b.member_id) return 1;
      return 0;
    });

    // Add serial number
    return groupedArray.map((group: any, index: number) => ({
      ...group,
      sNo: index + 1
    }));
  }, [rewardTransactions]);

  const handleRowClick = (row: any) => {
    setSelectedGroup(row);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedGroup(null);
  };

  const filteredData = groupedData.filter((group: any) =>
    Object.values(group).some(
      value => 
        value && 
        typeof value !== 'object' &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const groupedColumns = [
    {
      name: "S.No",
      selector: (row: any) => row.sNo,
      sortable: true,
      width: '100px'
    },
    {
      name: "Member",
      selector: (row: any) => formatMember(row),
      sortable: true,
    },
    {
      name: "Total Reward Transactions",
      selector: (row: any) => row.transactions.length,
      sortable: true,
    },
    {
      name: "Total Reward Amount",
      selector: (row: any) => row.totalAmount,
      sortable: true,
      format: (row: any) => `₹${row.totalAmount.toFixed(2)}`,
    },
  ];

  const noDataComponent = (
    <div style={{ padding: "24px" }}>
      {isError ? "Error loading data" : "No reward data available in table"}
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
        Reward Management
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
              List of Reward Payouts
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
                columns={groupedColumns}
                data={filteredData}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
                noDataComponent={noDataComponent}
                onRowClicked={handleRowClick}
                pointerOnHover
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#2c8786", color: "#fff" }}>
          Reward Transactions - {selectedGroup && formatMember(selectedGroup)}
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 0 }}>
          {selectedGroup && (
            <DataTable
              columns={getRewardColumns()}
              data={selectedGroup.transactions}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              highlightOnHover
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" sx={{ backgroundColor: "#2c8786", "&:hover": { backgroundColor: "#216867" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Reward;