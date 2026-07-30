// components/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import '../../Dashboard/dashboard.scss';

import DashboardCard from '../../../components/common/DashboardCard';
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
  parsePaymentRedirectParams,
  useCreatePaymentOrder,
  useCreateManualTopUp
} from '../../../api/Memeber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import ChatIcon from '@mui/icons-material/Chat';
import { toast } from 'react-toastify';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import QRPdf from '../../../assets/jee_sc.pdf';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/Api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5051";

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);
  const [selectedRepayAmount, setSelectedRepayAmount] = useState(1);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [loadAmount, setLoadAmount] = useState("");
  const [topUpPaymentMode, setTopUpPaymentMode] = useState<'online' | 'qr'>('online');

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      TokenService.setToken(token, true);
      searchParams.delete("token");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const memberId = TokenService.getMemberId();

  const { data: sponsorRewardData } = useCheckSponsorReward(memberId);
  const { data: walletOverview, isLoading: walletLoading } = useGetWalletOverview(memberId);
  const { isLoading: sponsersLoading } = useGetSponsers(memberId);
  const { data: memberDetails, isLoading: memberLoading } = useGetMemberDetails(memberId);
  const { mutate: climeLoan, isPending: isClaiming } = useClimeLoan();

  // Enhanced repay loan hook
  const { mutate: repayLoan, isPending: isRepaying } = useRepayLoan();

  // Payment verification hook
  const { mutate: verifyPayment, isPending: isVerifyingPayment } = useVerifyPayment();
  const createPaymentOrder = useCreatePaymentOrder();
  const createManualTopUp = useCreateManualTopUp();

  const handleManualTopUpPaid = () => {
    if (!loadAmount || parseFloat(loadAmount) <= 0) return;
    createManualTopUp.mutate(
      { memberId: memberId || '', amount: parseFloat(loadAmount) },
      {
        onSuccess: () => {
          setTopUpDialogOpen(false);
          setLoadAmount("");
          setTopUpPaymentMode('online');
        }
      }
    );
  };

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

  // Fetch Announcement
  const { data: announcementData } = useQuery({
    queryKey: ['announcement'],
    queryFn: async () => {
      const res = await api.get('/admin/announcement');
      return res.data;
    }
  });
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  useEffect(() => {
    if (announcementData && announcementData.success) {
      setLiveAnnouncement(announcementData.data || "");
    }
  }, [announcementData]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("new_announcement", (msg: string) => {
      setLiveAnnouncement(msg);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
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

  const handleTopUpSubmit = async () => {
    if (!loadAmount || parseFloat(loadAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      const paymentData: any = {
        amount: parseFloat(loadAmount),
        currency: "INR",
        customer: {
          customer_id: memberId || "",
          customer_email: memberDetails?.email || "",
          customer_phone: memberDetails?.mobileno || "",
          customer_name: memberDetails?.Name || ""
        },
        notes: {
          isWalletTopUp: true
        }
      };
      
      const response = await createPaymentOrder.mutateAsync(paymentData);
      
      if (response && response.payment_session_id) {
         try {
           const cashfree = await load({ mode: import.meta.env.PROD ? "production" : "sandbox" });
           
           let checkoutOptions = {
             paymentSessionId: response.payment_session_id,
             redirectTarget: "_modal",
           };

           cashfree.checkout(checkoutOptions).then((result: any) => {
             if (result.error) {
               toast.error("Payment failed or cancelled. Please try again.");
               setTopUpDialogOpen(false);
             } else if (result.redirect) {
               console.log("Payment will be redirected");
               setTopUpDialogOpen(false);
             } else if (result.paymentDetails) {
               toast.success("Payment successful! Amount will reflect in Top Up Wallet soon.");
               setTopUpDialogOpen(false);
               setLoadAmount("");
               // If there's an API to refresh top-up wallet, call it here
             }
           });
         } catch (sdkError) {
           console.error("Cashfree SDK Error:", sdkError);
           toast.error("Failed to load payment gateway");
         }
      }
    } catch (error) {
       console.error("Top up error:", error);
    }
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
  const dailyRoiAmount = walletOverview?.dailyRoi || 0;
  const dailyIncentiveAmount = walletOverview?.dailyIncentive || 0;
  const globalIncomeAmount = walletOverview?.globalIncome || 0;



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

  const memberName = memberDetails?.Name || memberDetails?.name || memberDetails?.username || 'Member';
  const firstLetter = memberName ? memberName.charAt(0).toUpperCase() : 'M';

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
          minHeight: { xs: 'auto', md: '160px' },
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: { xs: 8, sm: 8, md: 8 },
          py: { xs: 4, sm: 4, md: 5 },
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)'
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
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            px: { xs: 2, sm: 4, md: 6 },
            position: 'relative',
            zIndex: 20,
            gap: { xs: 3, sm: 4 }
          }}
        >
          {liveAnnouncement && (
            <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.5)', py: 1, px: 2, borderRadius: 2, borderLeft: '4px solid #f59e0b' }}>
              <Box component={"marquee" as any} style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {liveAnnouncement}
              </Box>
            </Box>
          )}

          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontSize: { xs: '1.7rem', sm: '1.8rem', md: '2.5rem' },
              textAlign: 'center',
              width: '100%'
            }}
          >
            Welcome to Jeeva Herbs
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: { xs: 3, sm: 4 }
            }}
          >
            {/* Top Box: Avatar and Info (Left) and Chat Icon (Right) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={memberDetails?.profile_image}
                  alt={memberName}
                  sx={{
                    width: { xs: 94, md: 114 },
                    height: { xs: 114, md: 114 },
                    bgcolor: '#ffffff',
                    color: '#299592',
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: '3px solid rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px'
                  }}
                >
                  {!memberDetails?.profile_image && firstLetter}
                </Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                      fontSize: { xs: '1.6rem', md: '1.8rem' }
                    }}
                  >
                    {memberName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '1.1rem', md: '1.15rem' },
                      mt: 0.5
                    }}
                  >
                    ID: <span style={{ fontWeight: 'bold', color: 'white' }}>{memberDetails?.Member_id || memberId || '—'}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: memberDetails?.status?.toLowerCase() === 'active' ? '#4ade80' : '#f87171',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 'bold',
                      mt: 0.5,
                      textTransform: 'capitalize'
                    }}
                  >
                    Status: {memberDetails?.status || 'Unknown'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Button
                  onClick={() => navigate('/user/chat')}
                  sx={{
                    minWidth: 'auto',
                    p: 2,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #da5c3dff 0%, #e1b67eff 100%)',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(15, 118, 110, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 0.9,
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <ChatIcon sx={{ fontSize: 32 }} />
                </Button>
              </Box>
            </Box>

            {/* Row for Earnings & Withdrawals (Side by side on all screens) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
                gap: { xs: 2, sm: 3 }
              }}
            >
              {/* Left Corner Box: Total Earnings */}
              <Box
                sx={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 95, 70, 0.35) 100%)',
                  border: '1px solid rgba(52, 211, 153, 0.55)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                  minWidth: { xs: '120px', sm: '140px' }
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.6rem' },
                    fontWeight: 'bold',
                    mb: 0.3,
                    color: '#6ee7b7'
                  }}
                >
                  {loading ? '₹0' : totalEarningsAmount}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#d1fae5', fontWeight: 600, letterSpacing: 0.5, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                    Earnings
                  </Typography>
                </Box>
              </Box>

              {/* Right Corner Box: Total Withdrawals */}
              <Box
                sx={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.22) 0%, rgba(154, 52, 18, 0.35) 100%)',
                  border: '1px solid rgba(251, 146, 60, 0.55)',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.25)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                  minWidth: { xs: '120px', sm: '140px' }
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.6rem' },
                    fontWeight: 'bold',
                    mb: 0.3,
                    color: '#fdba74'
                  }}
                >
                  {loading ? '₹0' : totalWithdrawsAmount}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#ffedd5', fontWeight: 600, letterSpacing: 0.5, fontSize: { xs: '0.65rem', sm: '0.7rem' }, textTransform: 'uppercase' }}>
                    Withdrawals
                  </Typography>
                </Box>
              </Box>
            </Box>

            
            {/* Next Payment Cycle Premium Banner */}
            <Box sx={{ 
              mt: {xs: 1, md: 3}, 
              width: '100%',
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '12px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Pulsing indicator dot */}
              <Box sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: '#34d399', 
                boxShadow: '0 0 10px #34d399'
              }} />
              <Typography variant="body1" sx={{ 
                color: '#a7f3d0', 
                fontWeight: '500',
                letterSpacing: 0.5,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Your next payment cycle on <span style={{ color: '#ffffff', fontWeight: '800', marginLeft: '4px' }}>
                {(() => {
                  const baseDateStr = memberDetails?.activationDate || memberDetails?.activation_date || memberDetails?.createdAt || memberDetails?.created_at;
                  
                  if (baseDateStr && memberDetails?.status?.toLowerCase() === 'active') {
                    let nextDate: Date | null = null;
                    const actDate = new Date(baseDateStr);
                    const txList = Array.isArray(transactionsResponse) 
                      ? transactionsResponse 
                      : (Array.isArray(transactionsResponse?.data) ? transactionsResponse.data : []);
                      
                    const withdrawals = txList.filter((t: any) => 
                      t?.transaction_type?.toLowerCase() === 'withdrawal' || 
                      t?.type?.toLowerCase() === 'withdrawal' ||
                      t?.description?.toLowerCase()?.includes('withdrawal')
                    );
                
                    if (withdrawals.length > 0) {
                      const latest = withdrawals.sort((a: any, b: any) => {
                        const dateA = new Date(a.date || a.createdAt || a.transaction_date || 0).getTime();
                        const dateB = new Date(b.date || b.createdAt || b.transaction_date || 0).getTime();
                        return dateB - dateA;
                      })[0];
                      const lastWDate = new Date(latest.date || latest.createdAt || latest.transaction_date);
                      nextDate = new Date(lastWDate.getTime() + 15 * 24 * 60 * 60 * 1000);
                    } else {
                      nextDate = new Date(actDate.getTime() + 15 * 24 * 60 * 60 * 1000);
                    }
                    return nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  } else {
                    return 'N/A';
                  }
                })()}
                </span>
              </Typography>
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

      {/* My Team Section */}
      <Box
        sx={{
          mx: { xs: 2, sm: 3, md: 4 },
          mt: 3,
          mb: 2,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: '#2c8786',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          My Team
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: { xs: 2, md: 4 }
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              p: { xs: 1.5, sm: 2 },
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}
          >
            <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {memberDetails ? (memberDetails.registration_stats?.direct ?? memberDetails.direct_referrals?.length ?? 0) : '—'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              Direct Team
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              p: { xs: 1.5, sm: 2 },
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}
          >
            <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {memberDetails ? (memberDetails.registration_stats?.total ?? memberDetails.total_team ?? 0) : '—'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              Total Team
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Referral Link Box */}
      <Box
        sx={{
          mx: { xs: 2, sm: 3, md: 4 },
          my: 1.5,
          p: 2,
          backgroundColor: '#f8f5ff9b',
          borderRadius: 2,
          border: '1px solid #e9d5ff',
          boxShadow: '0 2px 8px rgba(44, 135, 134, 0.10)',
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

        {/* <Typography
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
        </Typography> */}
      </Box>

      {/* Dashboard Cards Grid */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          my: 2,
          pt: 3,
          width: '100%',
          '& .MuiGrid-item': {
            display: 'flex',
          }
        }}
      >
        {/* Custom Top Up Wallet Card Moved to First Position */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => navigate('/user/topup-wallet')}
            sx={{
              background: 'linear-gradient(135deg, rgba(230, 245, 245, 0.8) 0%, rgba(200, 235, 235, 0.8) 100%)',
              color: '#1e293b',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(44, 135, 134, 0.3)',
              borderRadius: '24px',
              padding: { xs: '6px', sm: '8px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
              height: '100%',
              minHeight: { xs: '120px', sm: '160px' },
              width: '100%',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
              }
            }}
          >
            <CardContent sx={{ p: { xs: '12px', sm: '16px' } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Top Up Wallet
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', sm: '1.5rem' }, color: '#2c8786' }}>
                ₹{memberDetails?.top_up_wallet_balance?.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
            <Box sx={{ p: { xs: '12px', sm: '16px' }, display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/user/wallet-transfer');
                }}
                sx={{
                  borderColor: '#2c8786',
                  color: '#2c8786',
                  '&:hover': { backgroundColor: 'rgba(44, 135, 134, 0.1)', borderColor: '#236d6c' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 0.8
                }}
              >
                Transfer
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  setTopUpDialogOpen(true);
                }}
                sx={{
                  backgroundColor: '#2c8786',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#236d6c' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 0.8
                }}
              >
                Load
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/user/income/direct')} amount={loading ? 0 : directBenefitsAmount} title="Direct Income" background="blur_gray" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/user/income/level')} amount={loading ? 0 : levelBenefitsAmount} title="Level Income" background="blur_gray" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/user/income/daily-roi')} amount={loading ? 0 : dailyRoiAmount} title="Cash Back" background="blur_gray" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/user/income/daily-incentive')} amount={loading ? 0 : dailyIncentiveAmount} title="Daily Incentive" background="blur_gray" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/user/income/global')} amount={loading ? 0 : globalIncomeAmount} title="Rewards" background="blur_gray" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/user/wallet')} amount={loading ? 0 : walletBalanceAmount} title="Wallet Balance" background="blur_gray" />
        </Grid>

        {isLoanApproved && (
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              amount={initialLoanAmount}
              dueAmount={dueAmount}
              title="Loan Amount"
              type="loan"
              background="blur_gray"
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

      {/* Top Up Wallet Dialog */}
      <Dialog
        open={topUpDialogOpen}
        onClose={() => setTopUpDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: { xs: '320px', sm: '400px' },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#2c8786', fontWeight: 'bold', fontSize: '1.5rem', pb: 1 }}>
          Top Up Wallet
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>User ID</Typography>
              <input
                type="text"
                value={memberId || ''}
                readOnly
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>Name</Typography>
              <input
                type="text"
                value={memberName}
                readOnly
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  outline: 'none'
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>Amount (₹)</Typography>
              <input
                type="number"
                value={loadAmount}
                onChange={(e) => setLoadAmount(e.target.value)}
                placeholder="Enter amount to load"
                disabled={createPaymentOrder.isPending}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>Payment Mode</Typography>
              <RadioGroup
                row
                value={topUpPaymentMode}
                onChange={(e) => setTopUpPaymentMode(e.target.value as 'online' | 'qr')}
              >
                <FormControlLabel value="online" control={<Radio sx={{color: '#2c8786', '&.Mui-checked': {color: '#2c8786'}}} />} label="Online Pay (Cashfree)" />
                <FormControlLabel value="qr" control={<Radio sx={{color: '#2c8786', '&.Mui-checked': {color: '#2c8786'}}} />} label="QR Pay (UPI)" />
              </RadioGroup>
            </FormControl>
            {topUpPaymentMode === 'qr' && (
              <Box sx={{ mt: 1, p: 2, border: '1px solid #e2e8f0', borderRadius: 2, textAlign: 'center', backgroundColor: '#f8fafc' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>Scan to Pay</Typography>
                <Box sx={{ mt: 2, mb: 2, height: '250px', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                  <iframe src={`${QRPdf}#toolbar=0&view=Fit`} width="100%" height="100%" style={{ border: 'none' }} title="QR Code" />
                </Box>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: '#2c8786' }}>
                  UPI ID: jeeva_sc@upi
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
                  After successful payment, please contact admin with your transaction screenshot.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={() => setTopUpDialogOpen(false)}
            variant="outlined"
            disabled={createPaymentOrder.isPending || createManualTopUp.isPending}
            sx={{
              borderColor: '#6b7280', color: '#6b7280', textTransform: 'capitalize', fontWeight: 'bold', px: 3,
              '&:hover': { borderColor: '#4b5563', backgroundColor: '#f3f4f6' }
            }}
          >
            {topUpPaymentMode === 'qr' ? 'Cancel' : 'Cancel'}
          </Button>
          {topUpPaymentMode === 'online' && (
            <Button
              onClick={handleTopUpSubmit}
              variant="contained"
              disabled={createPaymentOrder.isPending || !loadAmount || parseFloat(loadAmount) <= 0}
              sx={{
                backgroundColor: '#2c8786', textTransform: 'capitalize', fontWeight: 'bold', px: 3,
                '&:hover': { backgroundColor: '#236d6c' }
              }}
            >
              {createPaymentOrder.isPending ? 'Processing...' : 'Submit'}
            </Button>
          )}
          {topUpPaymentMode === 'qr' && (
            <Button
              onClick={handleManualTopUpPaid}
              variant="contained"
              disabled={createManualTopUp.isPending || !loadAmount || parseFloat(loadAmount) <= 0}
              sx={{
                backgroundColor: '#10b981', textTransform: 'capitalize', fontWeight: 'bold', px: 3,
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              {createManualTopUp.isPending ? 'Sending...' : 'Paid'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Member Statistics */}
      {/* <Box sx={{ mt: 10, p: 4, borderRadius: 2, boxShadow: 2 }}>
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
      </Box> */}
    </>
  );
}

export default UserDashboard;