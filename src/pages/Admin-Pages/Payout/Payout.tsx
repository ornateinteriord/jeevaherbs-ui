import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  Button
} from "@mui/material";
import { useState } from "react";
import "./Payout.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataTable from "react-data-table-component";
import { DASHBOARD_CUTSOM_STYLE, getProccessedColumns, getRequestColumns, getPayablesColumns } from "../../../utils/DataTableColumnsProvider";
import { useApproveWithdrawal, useGetApprovedWithdrawals, useGetPendingWithdrawals, useGetPayables, useProcessAdminPayout } from "../../../api/Memeber";

interface PayoutTableProps {
  data: any[];
  columns: any;
  tabTitle: any[];
  loading?: boolean;
}

const Payout = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_e: any, newValue: any) => {
    setValue(newValue);
  };

  const renderContent = () => {
    switch (value) {
      case 0:
        return <Payables tabTitle={"Payables"} />;
      case 1:
        return <Requests tabTitle={"Withdrawal Requests"} />;
      case 2:
        return <Proccessed tabTitle={"Processed Withdrawals"} />;
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ margin: "2rem", mt: 10 }}>
        Payouts
      </Typography>
      <Card sx={{ margin: "2rem", mt: 2 }}>
        <CardContent>
          <Box className="tabs-list">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              className="tabs"
            >
              <Tab className="tab-list-1" label="Payables" />
              <Tab className="tab-list-2" label="Withdrawal Requests" />
              <Tab className="tab-list-3" label="Processed Withdrawals" />
            </Tabs>
            <Box className="tab-content">{renderContent()}</Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Payout;

const PayoutTable = ({ data, columns, tabTitle, loading }: PayoutTableProps) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          mt: 2,
          backgroundColor: "#2c8786",
          color: "#fff",
          "& .MuiSvgIcon-root": { color: "#fff" },
        }}
      >
        {tabTitle}
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
            placeholder="Search withdrawals..."
            sx={{ minWidth: 200 }}
          />
        </Box>
        <DataTable
          columns={columns}
          data={data}
          pagination
          customStyles={DASHBOARD_CUTSOM_STYLE}
          paginationPerPage={25}
          progressPending={loading}
          paginationRowsPerPageOptions={[25, 50, 100]}
          highlightOnHover
          noDataComponent={<div>No withdrawal data available</div>}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const Requests = ({ tabTitle }: { tabTitle: any }) => {
  const { data: pending = [], isFetching } = useGetPendingWithdrawals();
  const { mutate: approveTransaction, isPending } = useApproveWithdrawal();

  // Filter only withdrawal requests
  const withdrawalRequests = pending?.filter((transaction: any) => {
    const transactionType = String(transaction.transaction_type || '').toLowerCase();
    const description = String(transaction.description || '').toLowerCase();
    
    return (
      transactionType.includes('withdrawal') ||
      description.includes('withdrawal request') ||
      description.includes('withdrawal')
    );
  }) || [];

  return (
    <PayoutTable
      data={withdrawalRequests}
      columns={getRequestColumns(approveTransaction)}
      tabTitle={tabTitle}
      loading={isFetching || isPending}
    />
  );
};

export const Proccessed = ({ tabTitle }: { tabTitle: any }) => {
  const { data: Approved, isFetching } = useGetApprovedWithdrawals();

  // Filter only processed withdrawals (excluding level/direct benefits)
  const filteredData = Approved?.filter((transaction: any) => {
    const description = String(transaction.description || '').toLowerCase();
    const transactionType = String(transaction.transaction_type || '').toLowerCase();
    
    // Check if it's a withdrawal transaction
    const isWithdrawal = (
      transactionType.includes('withdrawal') ||
      description.includes('withdrawal request') ||
      description.includes('withdrawal')
    );

    // Exclude level and direct benefits
    const isLevelBenefits = description.includes('level benefit') || 
                           description.includes('level benefits') ||
                           transactionType.includes('level benefit') ||
                           transactionType.includes('level benefits');

    const isDirectBenefits = description.includes('direct benefit') || 
                            description.includes('direct benefits') ||
                            transactionType.includes('direct benefit') ||
                            transactionType.includes('direct benefits');

    return isWithdrawal && !isLevelBenefits && !isDirectBenefits;
  }) || [];

  return (
    <PayoutTable
      data={filteredData}
      columns={getProccessedColumns()}
      tabTitle={tabTitle}
      loading={isFetching}
    />
  );
};

export const Payables = ({ tabTitle }: { tabTitle: any }) => {
  const { data: payablesList, isFetching } = useGetPayables();
  const { mutate: processPayout, isPending } = useProcessAdminPayout();

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [payType, setPayType] = useState('full');
  const [customAmount, setCustomAmount] = useState('');

  const handlePayNow = (member: any) => {
    setSelectedMember(member);
    setPayType('full');
    setCustomAmount(member.availableBalance?.toString() || '');
    setPayModalOpen(true);
  };

  const handleClose = () => {
    if (!isPending) {
      setPayModalOpen(false);
      setSelectedMember(null);
    }
  };

  const handleSubmit = () => {
    if (!selectedMember) return;
    const amount = payType === 'full' ? selectedMember.availableBalance : Number(customAmount);
    
    if (!amount || amount <= 0 || amount > selectedMember.availableBalance) {
      alert("Invalid payment amount");
      return;
    }

    processPayout(
      { member_id: selectedMember.member_id, amount, payment_mode: "Manual" },
      {
        onSuccess: () => {
          handleClose();
        }
      }
    );
  };

  return (
    <>
      <PayoutTable
        data={payablesList || []}
        columns={getPayablesColumns(handlePayNow)}
        tabTitle={tabTitle}
        loading={isFetching}
      />

      <Dialog open={payModalOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: '#2c8786', fontWeight: 'bold' }}>Process Manual Payout</DialogTitle>
        <DialogContent dividers>
          {selectedMember && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography>
                <strong>Member:</strong> {selectedMember.Name} ({selectedMember.member_id})
              </Typography>
              <Typography>
                <strong>Available Balance:</strong> ₹{selectedMember.availableBalance?.toLocaleString()}
              </Typography>
              <Typography>
                <strong>UPI ID:</strong> {selectedMember.upiId || 'Not provided'}
              </Typography>

              <RadioGroup
                value={payType}
                onChange={(e) => {
                  setPayType(e.target.value);
                  if (e.target.value === 'full') {
                    setCustomAmount(selectedMember.availableBalance.toString());
                  } else {
                    setCustomAmount('');
                  }
                }}
              >
                <FormControlLabel value="full" control={<Radio />} label="Pay Full Amount" />
                <FormControlLabel value="partial" control={<Radio />} label="Pay Partial Amount" />
              </RadioGroup>

              {payType === 'partial' && (
                <TextField
                  fullWidth
                  label="Enter Amount (₹)"
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  disabled={isPending}
                  size="small"
                  inputProps={{ max: selectedMember.availableBalance, min: 1 }}
                />
              )}

              {/* Dynamic TDS & Net Payout Display */}
              {customAmount && Number(customAmount) > 0 && (
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, border: '1px solid #ddd' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Payout Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Requested Amount:</Typography>
                    <Typography variant="body2" fontWeight="bold">₹{Number(customAmount).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="error">Admin(Service)charges (10%):</Typography>
                    <Typography variant="body2" color="error" fontWeight="bold">-₹{(Number(customAmount) * 0.10).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #ccc' }}>
                    <Typography variant="body1" fontWeight="bold" color="#2c8786">Final Amount to Transfer:</Typography>
                    <Typography variant="body1" fontWeight="bold" color="#2c8786">₹{(Number(customAmount) * 0.90).toLocaleString()}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || (payType === 'partial' && (!customAmount || Number(customAmount) <= 0 || Number(customAmount) > selectedMember?.availableBalance))}
            variant="contained"
            sx={{ backgroundColor: '#2c8786', '&:hover': { backgroundColor: '#236d6c' } }}
          >
            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};