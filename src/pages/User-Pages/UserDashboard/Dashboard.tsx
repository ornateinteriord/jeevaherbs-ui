// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Link,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import '../../Dashboard/dashboard.scss';
import DashboardTable from '../../Dashboard/DashboardTable';
import { MuiDatePicker } from '../../../components/common/DateFilterComponent';
import DashboardCard from '../../../components/common/DashboardCard';
import { getUserDashboardTableColumns } from '../../../utils/DataTableColumnsProvider';
import TokenService from '../../../api/token/tokenService';
import {
  useCheckSponsorReward,
  useGetWalletOverview,
  useGetSponsers,
  useGetMemberDetails,
  useClimeLoan,
  useGetTransactionDetails,
  useRepayLoan,
  useVerifyPayment,
  parsePaymentRedirectParams
} from '../../../api/Memeber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);
  const [selectedRepayAmount, setSelectedRepayAmount] = useState(1);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  const memberId = TokenService.getMemberId();

  const { data: sponsorRewardData } = useCheckSponsorReward(memberId);
  const { data: walletOverview, isLoading: walletLoading } = useGetWalletOverview(memberId);
  const { data: sponsersData, isLoading: sponsersLoading } = useGetSponsers(memberId);
  const { data: memberDetails, isLoading: memberLoading } = useGetMemberDetails(memberId);
  const { mutate: climeLoan, isPending: isClaiming } = useClimeLoan();

  // Use the enhanced repay loan hook
  const { mutate: repayLoan, isPending: isRepaying } = useRepayLoan();

  // Payment verification hook
  const { mutate: verifyPayment, isPending: isVerifyingPayment } = useVerifyPayment();

  const { data: transactionsResponse, isLoading: loanStatusLoading, refetch: refetchTransactions } = useGetTransactionDetails("all");

  // Handle payment redirect from payment gateway
  useEffect(() => {
    const paymentParams = parsePaymentRedirectParams(searchParams);

    if (paymentParams.order_id && paymentParams.payment_status && !paymentProcessed) {
      console.log("🔄 Processing payment redirect:", paymentParams);
      setPaymentProcessed(true);

      // Verify the payment with backend
      verifyPayment(paymentParams.order_id, {
        onSuccess: () => {
          // Clear URL params after processing
          setSearchParams({});
          // Refresh transactions to show updated data
          refetchTransactions();
        },
        onError: () => {
          // Still clear URL params even on error
          setSearchParams({});
        }
      });
    }
  }, [searchParams, paymentProcessed, verifyPayment, setSearchParams, refetchTransactions]);

  const allTransactions = transactionsResponse?.data || [];
  const isRepayEnabled = transactionsResponse?.isRepayEnabled || false;
  const alreadyRepaidToday = transactionsResponse?.alreadyRepaidToday || false;

  const approvedLoan = Array.isArray(allTransactions)
    ? allTransactions.find((transaction: any) =>
      transaction.status?.toLowerCase() === 'approved' &&
      (transaction.transaction_type?.includes('Loan') || transaction.benefit_type === 'loan')
    )
    : null;

  const isLoanApproved = !!approvedLoan;

  const initialLoanAmount = approvedLoan?.ew_credit ? parseFloat(approvedLoan.ew_credit) : 0;
  // Find the last completed repayment
  const lastCompletedRepayment = Array.isArray(allTransactions)
    ? allTransactions
      .filter((t: any) => t.is_loan_repayment && t.repayment_status === "Completed")
      .sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())[0]
    : null;

  // Now update dueAmount
  const dueAmount = lastCompletedRepayment?.repayment_context?.new_due_amount
    ? parseFloat(lastCompletedRepayment.repayment_context.new_due_amount)
    : approvedLoan?.net_amount
      ? parseFloat(approvedLoan.net_amount)
      : initialLoanAmount;


  // Find the first transaction with Processing or Approved status
  const processingOrApprovedTransaction = Array.isArray(allTransactions)
    ? allTransactions.find((transaction: any) =>
      transaction.status &&
      (transaction.status.toLowerCase() === 'processing' ||
        transaction.status.toLowerCase() === 'approved')
    )
    : null;

  const getStatusButtonText = () => {
    if (processingOrApprovedTransaction) {
      return processingOrApprovedTransaction.status;
    }
    return null;
  };

  const statusButtonText = getStatusButtonText();
  const hasProcessingOrApprovedStatus = !!statusButtonText;

  const loading = walletLoading || sponsersLoading || memberLoading || loanStatusLoading;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleClaimReward = () => {
    setClaimDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setClaimDialogOpen(false);
  };

  const handleConfirmClaim = () => {
    if (!memberId) {
      toast.error("Member ID not found!");
      return;
    }
    const payload = {
      note: "Requesting reward loan",
    };

    climeLoan(
      { memberId, data: payload },
      {
        onSuccess: () => {
          setClaimDialogOpen(false);
          toast.success('Loan request submitted successfully!');
          refetchTransactions();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to submit loan request");
        }
      }
    );
  };

  // Enhanced repayment handler
  const handleRepayment = () => {
    if (!memberId) {
      toast.error("Member ID not found");
      return;
    }

    if (selectedRepayAmount <= 0) {
      toast.error("Please select a valid repayment amount");
      return;
    }

    if (selectedRepayAmount > dueAmount) {
      toast.error(`Repayment amount cannot exceed due amount of ₹${dueAmount}`);
      return;
    }

    console.log("💰 Starting repayment process:", {
      memberId,
      amount: selectedRepayAmount,
      dueAmount
    });

    repayLoan({
      memberId,
      amount: selectedRepayAmount,
      memberDetails
    }, {
      onSuccess: (data) => {
        console.log("✅ Repayment initiated successfully:", data);
        setRepaymentDialogOpen(false);
        // The actual payment flow will redirect to payment gateway
      },
      onError: (error: any) => {
        console.error("❌ Failed to create repayment order:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    });
  };

  const handleCopyReferralLink = () => {
    if (!memberDetails?.Member_id) return;

    const referralLink = `${window.location.origin}/register?ref=${memberDetails.Member_id}`;

    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy referral link');
      });
  };

  const handleShareReferralLink = () => {
    if (!memberDetails?.Member_id) return;

    const referralLink = `${window.location.origin}/register?ref=${memberDetails.Member_id}`;

    if (navigator.share) {
      navigator.share({
        title: 'Join me!',
        text: 'Check out this amazing platform and join using my referral link!',
        url: referralLink,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      handleCopyReferralLink();
    }
  };

  const levelBenefitsAmount = walletOverview?.levelBenefits || 0;
  const directBenefitsAmount = walletOverview?.directBenefits || 0;
  const totalEarningsAmount = walletOverview?.totalBenefits || 0;
  const totalWithdrawsAmount = walletOverview?.totalWithdrawal || 0;
  const walletBalanceAmount = walletOverview?.balance || 0;

  const tableData = [
    {
      title: "Today's Registration",
      direct: sponsersData?.sponsoredUsers?.filter((user: any) => user.status === 'active')?.length || 0,
      indirect: 0,
      total: sponsersData?.sponsoredUsers?.filter((user: any) => user.status === 'active')?.length || 0,
    },
    {
      title: "Today's Activation",
      direct: sponsersData?.sponsoredUsers?.filter((user: any) =>
        user.status === 'active' &&
        user.activationDate?.toDateString() === new Date().toDateString()
      )?.length || 0,
      indirect: 0,
      total: sponsersData?.sponsoredUsers?.filter((user: any) =>
        user.status === 'active' &&
        user.activationDate?.toDateString() === new Date().toDateString()
      )?.length || 0,
    },
    {
      title: 'Total Registration',
      direct: memberDetails?.direct_referrals?.filter((ref: any) => ref.status === 'active')?.length || 0,
      indirect: (memberDetails?.total_team || 0) - (memberDetails?.direct_referrals?.filter((ref: any) => ref.status === 'active')?.length || 0),
      total: memberDetails?.total_team || 0,
    },
    {
      title: 'Total Activation',
      direct: memberDetails?.direct_referrals?.filter((ref: any) => ref.status === 'active')?.length || 0,
      indirect: (memberDetails?.total_team || 0) - (memberDetails?.direct_referrals?.filter((ref: any) => ref.status === 'active')?.length || 0),
      total: memberDetails?.total_team || 0,
    },
    {
      title: 'Current Month Activation',
      direct: memberDetails?.direct_referrals?.filter((ref: any) =>
        ref.status === 'active' &&
        new Date(ref.activationDate).getMonth() === new Date().getMonth() &&
        new Date(ref.activationDate).getFullYear() === new Date().getFullYear()
      )?.length || 0,
      indirect: 0,
      total: memberDetails?.direct_referrals?.filter((ref: any) =>
        ref.status === 'active' &&
        new Date(ref.activationDate).getMonth() === new Date().getMonth() &&
        new Date(ref.activationDate).getFullYear() === new Date().getFullYear()
      )?.length || 0,
    },
  ];

  const handleRepayClick = () => {
    if (isRepayEnabled) {
      setRepaymentDialogOpen(true);
    } else if (alreadyRepaidToday) {
      toast.info('You have already made a repayment today. Only one repayment allowed per Saturday.');
    } else {
      toast.warning('Repayment is only available on Saturdays.');
    }
  };

  // Get button style based on status
  const getButtonStyle = (status: string, isDisabled: boolean = false) => {
    const baseStyle = {
      textTransform: 'capitalize' as const,
      fontWeight: 'bold',
      px: 4,
      py: 1,
    };

    if (isDisabled) {
      return {
        ...baseStyle,
        backgroundColor: '#90EE90',
        color: '#000000',
        '&:hover': {
          backgroundColor: '#90EE90',
        },
        '&.Mui-disabled': {
          backgroundColor: '#90EE90',
          color: '#000000',
        }
      };
    }

    switch (status?.toLowerCase()) {
      case 'processing':
        return {
          ...baseStyle,
          backgroundColor: '#FFA500',
          '&:hover': { backgroundColor: '#FF8C00' },
        };
      case 'approved':
        return {
          ...baseStyle,
          backgroundColor: '#28a745',
          '&:hover': { backgroundColor: '#218838' },
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#DDAC17',
          '&:hover': { backgroundColor: '#Ecc440' },
        };
    }
  };

  return (
    <>
      {/* Payment verification loading overlay */}
      {isVerifyingPayment && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Verifying your payment...
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          height: { xs: 'auto', md: '100px' },
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: { xs: 6, md: 8 },
          py: { xs: 6, md: 0 },
          backgroundColor: "#299592",
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 20,
            pointerEvents: 'none',
            maskImage: 'radial-gradient(transparent,black)'
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
            px: { xs: 4, md: 8 },
            position: 'relative',
            zIndex: 20,
            gap: { xs: 6, md: 0 }
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontSize: { xs: '1.5rem', md: '2.5rem' }
              }}
            >
              Welcome to Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                color: '#ffff',
                fontSize: { xs: '0.875rem', md: '1rem' },
                textAlign: 'center'
              }}
            >
              Manage your network and track your success
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 6, md: 12 },
              color: 'white'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                {memberDetails ? `${memberDetails.direct_referrals?.length || 0}/${memberDetails.direct_referrals?.length || 0}` : '—'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <span className="material-icons text-base md:text-lg">person</span>
                <Typography variant="caption">Direct</Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                {memberDetails ? `${memberDetails.total_team || 0}/${memberDetails.total_team || 0}` : '—'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <span className="material-icons text-base md:text-lg">groups</span>
                <Typography variant="caption">Team</Typography>
              </Box>
            </Box>
          </Box>

          {/* Show status button when Processing or Approved, otherwise show Claim Reward if eligible */}
          {hasProcessingOrApprovedStatus ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                sx={getButtonStyle(statusButtonText, true)}
                disabled
              >
                {statusButtonText}
              </Button>
            </Box>
          ) : sponsorRewardData?.isEligibleForReward ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleClaimReward}
                sx={getButtonStyle('claim', false)}
              >
                Claim Reward
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* Referral Link Box */}
      <Box
        sx={{
          mx: { xs: 2, sm: 3, md: 4 },
          my: 1.5,
          p: 2,
          backgroundColor: '#f8f5ff',
          borderRadius: 2,
          border: '1px solid #e9d5ff',
          boxShadow: '0 2px 8px rgba(44, 135, 134, 0.1)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: '#2c8786',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Your Referral Link
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: { sm: '400px', md: '500px' },
              width: '100%'
            }}
          >
            <Link
              href={memberDetails?.Member_id ? `${window.location.origin}/register?ref=${memberDetails.Member_id}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#2c8786',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
                display: 'block',
                p: 1.5,
                backgroundColor: 'white',
                borderRadius: 1,
                border: '1px solid #d8b4fe',
                wordBreak: 'break-all',
                textAlign: 'center',
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#2c8786',
                  fontWeight: 'medium',
                }}
              >
                {memberDetails?.Member_id ?
                  `${window.location.origin}/register?ref=${memberDetails.Member_id}` :
                  'Loading...'
                }
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'row', sm: 'column', md: 'row' },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'space-between', sm: 'center' }
            }}
          >
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyReferralLink}
              disabled={!memberDetails?.Member_id}
              sx={{
                backgroundColor: '#2c8786',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#236d6c',
                },
                fontWeight: 'bold',
                textTransform: 'none',
                minWidth: { xs: '140px', sm: 'auto' }
              }}
            >
              Copy Link
            </Button>

            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareReferralLink}
              disabled={!memberDetails?.Member_id}
              sx={{
                borderColor: '#2c8786',
                color: '#2c8786',
                '&:hover': {
                  backgroundColor: '#f3e8ff',
                  borderColor: '#236d6c',
                },
                fontWeight: 'bold',
                textTransform: 'none',
                minWidth: { xs: '140px', sm: 'auto' }
              }}
            >
              Share Link
            </Button>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 1,
            color: '#2c8786',
            opacity: 0.8
          }}
        >
          Share this link with friends and earn rewards when they join!
        </Typography>
      </Box>

      {/* Dashboard Cards Grid */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          mx: { xs: 1, sm: 2 },
          my: 2,
          pt: 3,
          pr: 7,
          width: 'auto',
          '& .MuiGrid-item': {
            display: 'flex',
          }
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard amount={loading ? 0 : levelBenefitsAmount} title="Level Benefits" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard amount={loading ? 0 : directBenefitsAmount} title="Direct Benefits" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard amount={loading ? 0 : totalEarningsAmount} title="Total Earnings" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard amount={loading ? 0 : totalWithdrawsAmount} title="Total Withdraws" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard amount={loading ? 0 : walletBalanceAmount} title="Wallet Balance" />
        </Grid>

        {isLoanApproved && (
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              amount={initialLoanAmount}
              dueAmount={dueAmount}
              title="Loan Amount"
              type="loan"
              onRepay={handleRepayClick}
              isRepayEnabled={isRepayEnabled}
              alreadyRepaidToday={alreadyRepaidToday}
            />
          </Grid>
        )}
      </Grid>

      {/* Claim Reward Dialog */}
      <Dialog
        open={claimDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="claim-reward-dialog-title"
        aria-describedby="claim-reward-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 1,
            minWidth: { xs: '300px', sm: '400px' }
          }
        }}
      >
        <DialogTitle
          id="claim-reward-dialog-title"
          sx={{
            textAlign: 'center',
            color: '#2c8786',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            pb: 1
          }}
        >
          🎉 Congratulations!
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="claim-reward-dialog-description"
            sx={{
              textAlign: 'center',
              color: '#4b5563',
              fontSize: '1.1rem',
              mb: 2
            }}
          >
            <p>
              You are eligible for a reward loan of{" "}
              <span style={{ color: "gold", fontWeight: "bold" }}>₹5000</span>!
            </p>
          </DialogContentText>

          <DialogContentText
            sx={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.9rem'
            }}
          >
            Submit your loan request and our admin team will review and approve the appropriate amount based on your eligibility.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              textTransform: 'capitalize',
              borderColor: '#6b7280',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f3f4f6',
              },
              fontWeight: 'bold',
              px: 4,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClaim}
            variant="contained"
            autoFocus
            disabled={isClaiming}
            sx={{
              textTransform: 'capitalize',
              backgroundColor: '#2c8786',
              '&:hover': { backgroundColor: '#236d6c' },
              fontWeight: 'bold',
              px: 4,
            }}
          >
            {isClaiming ? 'Processing...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Repayment Dialog */}
      <Dialog
        open={repaymentDialogOpen}
        onClose={() => !isRepaying && setRepaymentDialogOpen(false)}
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
            pb: 1
          }}
        >
          Loan Repayment
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
            <Typography
              variant="subtitle2"
              sx={{
                color: '#6b7280',
                mb: 1.5,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Loan Summary
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '1px solid #e2e8f0'
              }}>
                <Typography sx={{ color: '#64748b' }}>Total Loan</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{initialLoanAmount.toFixed(2)}</Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                backgroundColor: '#f0fdf4',
                borderRadius: 2,
                border: '1px solid #bbf7d0'
              }}>
                <Typography sx={{ color: '#64748b' }}>Amount Paid</Typography>
                <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                  ₹{(initialLoanAmount - dueAmount).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                backgroundColor: '#fef2f2',
                borderRadius: 2,
                border: '1px solid #fecaca'
              }}>
                <Typography sx={{ color: '#64748b' }}>Due Amount</Typography>
                <Typography sx={{ fontWeight: 700, color: '#dc2626' }}>
                  ₹{dueAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <FormControl fullWidth size="medium" sx={{ mt: 2 }}>
            <InputLabel sx={{ fontWeight: 500 }}>Repayment Amount</InputLabel>
            <Select
              value={selectedRepayAmount}
              label="Repayment Amount"
              onChange={(e) => setSelectedRepayAmount(Number(e.target.value))}
              disabled={isRepaying}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d1d5db',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2c8786',
                },
              }}
            >
              {[1, 500]
                .filter(amount => amount <= dueAmount)
                .map((amount) => (
                  <MenuItem
                    key={amount}
                    value={amount}
                    sx={{ fontWeight: amount === dueAmount ? 600 : 400 }}
                  >
                    ₹{amount} {amount === dueAmount && '(Full Payment)'}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {isRepaying && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <CircularProgress size={20} sx={{ color: '#2c8786' }} />
              <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                Initializing payment...
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{
          justifyContent: 'center',
          pb: 2,
          pt: 1,
          gap: 1,
        }}>
          <Button
            onClick={() => setRepaymentDialogOpen(false)}
            variant="outlined"
            disabled={isRepaying}
            sx={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              fontWeight: 600,
              textTransform: 'capitalize',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                backgroundColor: '#f3f4f6',
                borderColor: '#9ca3af',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRepayment}
            variant="contained"
            disabled={isRepaying || selectedRepayAmount === 0}
            sx={{
              background: 'linear-gradient(135deg, #2c8786 0%, #3da1a0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #236d6c 0%, #2c8786 100%)',
                boxShadow: '0 4px 12px rgba(44, 135, 134, 0.3)',
              },
              textTransform: 'capitalize',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              boxShadow: 'none',
            }}
          >
            {isRepaying ? 'Processing...' : 'Pay now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Member Statistics */}
      <Box sx={{ mt: 10, p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Card sx={{ backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c8786' }}>Member Statistics</Typography>
              <MuiDatePicker
                date={selectedDate}
                setDate={handleDateChange}
                label="Filter by Date"
              />
            </Box>

            <DashboardTable data={tableData} columns={getUserDashboardTableColumns()} />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default UserDashboard;