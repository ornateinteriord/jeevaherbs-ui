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
  TextField,
} from '@mui/material';
import DataTable from 'react-data-table-component';
import { DASHBOARD_CUTSOM_STYLE, getWithdrawPendingColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetPendingWithdrawals, useApproveWithdrawal } from '../../../api/Memeber';
import { toast } from 'react-toastify';

const WithdrawPending: React.FC = () => {
  const { data: pending = [], isFetching } = useGetPendingWithdrawals();
  const { mutate: approveWithdrawal, isPending: isApproving } = useApproveWithdrawal();
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

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
    setRepayDialogOpen(true);
  };

  const handleConfirmRepay = () => {
    if (!selectedTx) return;

    approveWithdrawal(selectedTx.transaction_id, {
      onSuccess: () => {
        setRepayDialogOpen(false);
        setSelectedTx(null);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || err.message || 'Failed to approve withdrawal');
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
              progressPending={isFetching || isApproving}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              noDataComponent={<div>No withdrawal requests found</div>}
            />
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog
        open={repayDialogOpen}
        onClose={() => { !isApproving && setRepayDialogOpen(false) }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: { xs: '320px', sm: '400px' },
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
          Approve Withdrawal
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
            Are you sure you want to approve this withdrawal request?
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
                <Typography sx={{ fontWeight: 600 }}>₹{Number(selectedTx?.ew_debit || 0).toFixed(2)}</Typography>
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
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setRepayDialogOpen(false)}
            variant="outlined"
            disabled={isApproving}
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
            disabled={isApproving}
            sx={{
              background: 'linear-gradient(135deg, #2c8786 0%, #236d6c 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1d5b5a 0%, #164645 100%)' },
              textTransform: 'capitalize',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            {isApproving ? <CircularProgress size={18} color="inherit" /> : 'Confirm Approval'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawPending;
