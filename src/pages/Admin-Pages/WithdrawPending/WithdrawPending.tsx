import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import DataTable from 'react-data-table-component';
import { DASHBOARD_CUTSOM_STYLE, getWithdrawPendingColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetPendingWithdrawals, useApproveWithdrawal, useCreatePaymentOrder } from '../../../api/Memeber';
import { toast } from 'react-toastify';

const WithdrawPending: React.FC = () => {
  const { data: pending = [], isFetching } = useGetPendingWithdrawals();
  const { isPending: isApproving } = useApproveWithdrawal();
  const { mutate: createPaymentOrder, isPending: isCreatingOrder } = useCreatePaymentOrder();
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [repayAmount, setRepayAmount] = useState<number>(500);
  const [manualAmount, setManualAmount] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);

  // Filter only withdrawal requests
  const withdrawalRequests = (pending || []).filter((transaction: any) => {
    const transactionType = String(transaction.transaction_type || '').toLowerCase();
    const description = String(transaction.description || '').toLowerCase();
    return (
      transactionType.includes('withdrawal') ||
      description.includes('withdrawal request') ||
      description.includes('withdrawal')
    );
  });

  const handleRepayClick = (tx: any) => {
    setSelectedTx(tx);
    setRepayAmount(tx?.ew_debit ? Number(tx.ew_debit) : 500);
    setManualAmount('');
    setTabValue(0);
    setRepayDialogOpen(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleManualAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setManualAmount(value);
    }
  };

  const getFinalRepayAmount = (): number => {
    if (tabValue === 0) return repayAmount;
    return manualAmount ? parseFloat(manualAmount) : 0;
  };

  const handleConfirmRepay = () => {
    if (!selectedTx) return;

    const finalAmount = getFinalRepayAmount();

    if (finalAmount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    // Optional: ensure not greater than requested amount
    const due = Number(selectedTx?.ew_debit || 0);
    if (finalAmount > due) {
      toast.error(`Payment exceeds requested amount ₹${due}`);
      return;
    }

    // Create payment order for approval
    const paymentData = {
      amount: finalAmount,
      currency: "INR",
      customer: {
        customer_id: selectedTx.member_id,
        customer_email: selectedTx.memberDetails?.email || "",
        customer_phone: selectedTx.memberDetails?.mobileno || "",
        customer_name: selectedTx.memberDetails?.Name || ""
      },
      notes: {
        transaction_id: selectedTx.transaction_id,
        isWithdrawal: true,
        withdrawalAmount: finalAmount
      }
    };

    createPaymentOrder(paymentData, {
      onSuccess: () => {
        // Payment order created successfully
        setRepayDialogOpen(false);
        setSelectedTx(null);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || err.message || 'Failed to initiate payment');
        setRepayDialogOpen(false);
        setSelectedTx(null);
      }
    });
  };

  return (
    <>
      <Typography variant="h4" sx={{ margin: '2rem', mt: 10 }}>
        Withdraw Requests (Pending)
      </Typography>
      <Card sx={{ margin: '2rem', mt: 2 }}>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {/* future: search / filters */}
          </Box>

          {withdrawalRequests.length === 0 && !isFetching ? (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <TextField
                  size="small"
                  placeholder="Search withdrawals..."
                  sx={{ minWidth: 240 }}
                />
              </Box>

              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: '#374151', fontSize: '1rem' }}>No withdrawal data available</Typography>
              </Box>
            </Box>
          ) : (
            <DataTable
              columns={getWithdrawPendingColumns((tx: any) => handleRepayClick(tx))}
              data={withdrawalRequests}
              pagination
              customStyles={DASHBOARD_CUTSOM_STYLE}
              paginationPerPage={25}
              progressPending={isFetching || isApproving || isCreatingOrder}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              noDataComponent={<div>No withdrawal requests found</div>}
            />
          )}
        </CardContent>
      </Card>

      {/* Repayment Dialog: styled to match LoansList */}
      <Dialog
        open={repayDialogOpen}
        onClose={() => { !isApproving && !isCreatingOrder && setRepayDialogOpen(false) }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: { xs: '320px', sm: '450px' },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            color: '#2c8786',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            pb: 1,
          }}
        >
          payment
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              textAlign: 'center',
              mb: 3,
              fontSize: '1rem',
              color: '#4b5563',
              lineHeight: 1.6,
            }}
          >
            Choose the repayment amount and confirm to proceed.
          </DialogContentText>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '1px solid #e2e8f0'
              }}>
                <Typography sx={{ color: '#64748b' }}>Requested Amount</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{Number(selectedTx?.net_amount || 0).toFixed(2)}</Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                backgroundColor: '#f0fdf4',
                borderRadius: 2,
                border: '1px solid #bbf7d0'
              }}>
                <Typography sx={{ color: '#64748b' }}>Member</Typography>
                <Typography sx={{ fontWeight: 600, color: '#059669' }}>{selectedTx?.member_id}</Typography>
              </Box>
            </Box>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Quick Amount" />
            <Tab label="Manual Amount" />
          </Tabs>

          {tabValue === 0 ? (
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Amount</InputLabel>
                <Select
                  value={repayAmount}
                  label="Amount"
                  onChange={(e) => setRepayAmount(Number(e.target.value))}
                >
                  {[500, 1000, 2000]
                    .filter(a => a <= Number(selectedTx?.ew_debit || 0))
                    .map(a => (
                      <MenuItem key={a} value={a}>₹{a} {a === Number(selectedTx?.ew_debit || 0) && '(Full)'}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Enter Amount</InputLabel>
                <input
                  value={manualAmount}
                  onChange={handleManualAmountChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                />
              </FormControl>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setRepayDialogOpen(false)}
            variant="outlined"
            disabled={isApproving || isCreatingOrder}
            sx={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              fontWeight: 600,
              textTransform: 'capitalize',
              borderRadius: 2,
              px: 3,
              '&:hover': { backgroundColor: '#f3f4f6', borderColor: '#9ca3af' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRepay}
            variant="contained"
            disabled={getFinalRepayAmount() === 0 || isApproving || isCreatingOrder}
            sx={{
              background: 'linear-gradient(135deg, #2c8786 0%, #a855f7 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #581c87 0%, #9333ea 100%)' },
              textTransform: 'capitalize',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            {isApproving || isCreatingOrder ? <CircularProgress size={18} color="inherit" /> : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawPending;
