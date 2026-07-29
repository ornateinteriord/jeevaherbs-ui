
import { Card, CardContent, Typography, Box, Grid, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import { 
  useGetMemberDetails, 
  useGetTransactionDetails, 
  useVerifyPayment, 
  parsePaymentRedirectParams 
} from '../../../api/Memeber';
import TokenService from '../../../api/token/tokenService';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TopUpWallet = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const memberId = TokenService.getMemberId();

  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const { mutate: verifyPayment } = useVerifyPayment();

  const { data: memberDetails, isLoading: isMemberLoading, refetch: refetchMember } = useGetMemberDetails(memberId);
  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useGetTransactionDetails("all");
  
  useEffect(() => {
    const paymentParams = parsePaymentRedirectParams(searchParams);

    if (paymentParams.order_id && paymentParams.payment_status && !paymentProcessed) {
      console.log("🔄 Processing Top-Up payment redirect:", paymentParams);
      setPaymentProcessed(true);

      verifyPayment(paymentParams.order_id, {
        onSuccess: () => {
          setSearchParams({});
          refetchTransactions();
          refetchMember();
        },
        onError: () => {
          setSearchParams({});
        }
      });
    }
  }, [searchParams, paymentProcessed, verifyPayment, setSearchParams, refetchTransactions, refetchMember]);

  const topUpBalance = memberDetails?.top_up_wallet_balance || 0;
  const isLoading = isMemberLoading || isTransactionsLoading;

  const topUpTransactions = transactionsData?.data?.filter(
    (tx: any) => tx.transaction_type === "Top Up Wallet"
  ) || [];

  const columns = [
    {
      name: 'S.No',
      selector: (_row: any, index?: number) => (index !== undefined ? index + 1 : 0),
      width: '70px',
    },
    {
      name: 'Transaction ID',
      selector: (row: any) => row.transaction_id,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row: any) => moment(row.transaction_date).format('DD MMM YYYY, hh:mm A'),
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row: any) => `₹${parseFloat(row.ew_credit || row.net_amount || 0).toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <span style={{ 
          color: row.status === 'Completed' ? '#059669' : '#dc2626',
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: row.status === 'Completed' ? '#d1fae5' : '#fee2e2'
        }}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  if (isLoading) {
    return (
      <Card
        sx={{
          margin: isMobile ? "1rem" : "2rem",
          mt: 10,
          textAlign: "center",
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress sx={{ color: "#2c8786" }} />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        margin: isMobile ? "1rem" : "2rem",
        backgroundColor: "#fff",
        mt: 10,
      }}
    >
      <CardContent sx={{ padding: isMobile ? "12px" : "24px" }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#2c8786', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWalletIcon /> Top Up Wallet
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, rgba(240, 246, 255, 0.70) 0%, rgba(167, 185, 206, 0.70) 100%)',
                borderRadius: 3,
                textAlign: "center",
                position: "relative",
                border: '1px solid rgba(44, 135, 134, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)'
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 'medium' }}>
                Available Balance
              </Typography>
              <Typography
                variant="h3"
                sx={{ 
                  color: "#2c8786", 
                  mt: 2, 
                  fontWeight: "bold" 
                }}
              >
                ₹{topUpBalance.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon /> Transaction History
          </Typography>
          <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <DataTable
              columns={columns}
              data={topUpTransactions}
              pagination
              highlightOnHover
              noDataComponent={
                <Box sx={{ p: 4, textAlign: 'center', color: '#64748b' }}>
                  No top up transactions found.
                </Box>
              }
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#f8fafc',
                    fontWeight: 'bold',
                    color: '#475569',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopUpWallet;
