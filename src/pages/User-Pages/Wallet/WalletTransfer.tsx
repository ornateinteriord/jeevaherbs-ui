import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import TokenService from "../../../api/token/tokenService";
import { useGetWalletOverview, useTransferToTopup, useGetMemberDetails } from "../../../api/Memeber";

const WalletTransfer = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [amount, setAmount] = useState("");
  const [optimisticAvailableBalance, setOptimisticAvailableBalance] = useState<number | null>(null);
  
  const memberId = TokenService.getMemberId();
  const userId = TokenService.getUserId();

  const {
    data: walletData,
    isLoading: isWalletLoading,
    refetch: refetchWallet,
  } = useGetWalletOverview(memberId);

  const {
    data: memberData,
    isLoading: isMemberLoading,
    refetch: refetchMember,
  } = useGetMemberDetails(userId);

  const transferMutation = useTransferToTopup();

  useEffect(() => {
    if (walletData?.balance) {
      const balance = parseFloat(walletData.balance);
      setOptimisticAvailableBalance(balance);
    }
  }, [walletData?.balance]);

  const handleAmountChange = (e: any) => {
    const selectedAmount = e.target.value;

    if (selectedAmount !== "" && !/^\d*\.?\d*$/.test(selectedAmount)) {
      return;
    }

    setAmount(selectedAmount);
  };

  const handleTransfer = () => {
    if (!amount || amount === "0") {
      return;
    }

    if (!memberId) {
      return;
    }

    const transferAmount = parseFloat(amount);
    const currentBalance = optimisticAvailableBalance !== null ? optimisticAvailableBalance : parseFloat(walletData?.balance || 0);
    
    if (transferAmount > currentBalance) {
      return;
    }

    const newBalance = currentBalance - transferAmount;
    setOptimisticAvailableBalance(newBalance);

    transferMutation.mutate(
      { memberId: memberId, amount: amount },
      {
        onSuccess: () => {
          setAmount("");
          refetchWallet();
          refetchMember();
        },
        onError: () => {
          // Revert optimistic update on error
          setOptimisticAvailableBalance(parseFloat(walletData?.balance || 0));
        }
      }
    );
  };

  const displayBalance = Math.max(0, optimisticAvailableBalance !== null ? optimisticAvailableBalance : parseFloat(walletData?.balance || 0));
  const topUpBalance = memberData?.top_up_wallet_balance || 0;

  if (isWalletLoading || isMemberLoading) {
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
        <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#2c8786" }}>
          Transfer to Top-up Wallet
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                textAlign: "center",
                border: "2px solid #2c8786",
                position: "relative",
              }}
            >
              <Typography variant="subtitle1" color="textSecondary">
                Withdrawal Wallet (Available Balance)
              </Typography>
              <Typography
                variant="h4"
                sx={{ 
                  color: "#2c8786", 
                  mt: 1, 
                  fontWeight: "bold" 
                }}
              >
                ₹{displayBalance.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" color="textSecondary">
                Top-up Wallet Balance
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: "#2c8786", mt: 1, fontWeight: "bold" }}
              >
                ₹{Number(topUpBalance).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ maxWidth: '500px', margin: '0 auto', mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Transfer Amount
          </Typography>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <TextField
              label="Amount to Transfer (₹)"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              size="medium"
              disabled={transferMutation.isPending}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#2c8786" },
                  "&.Mui-focused fieldset": { borderColor: "#2c8786" },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleTransfer}
              disabled={
                transferMutation.isPending || 
                !amount || 
                amount === "0" || 
                parseFloat(amount) > displayBalance
              }
              sx={{
                backgroundColor: "#2c8786",
                minHeight: "48px",
                "&:hover": { 
                  backgroundColor: "#1f6362" 
                },
                "&:disabled": { backgroundColor: "#cccccc" },
              }}
            >
              {transferMutation.isPending ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Transfer Funds"
              )}
            </Button>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletTransfer;
