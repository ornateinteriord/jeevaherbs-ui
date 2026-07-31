import { useState } from "react";
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
import { useGetMemberDetails, useLookupMember, useP2PTopupTransfer } from "../../../api/Memeber";
import { toast } from "react-toastify";

const WalletTransfer = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  
  const memberId = TokenService.getMemberId();
  const userId = TokenService.getUserId();

  const {
    data: memberData,
    isLoading: isMemberLoading,
    refetch: refetchMember,
  } = useGetMemberDetails(userId);

  const {
    data: lookupData,
    isLoading: isLookupLoading,
    refetch: triggerLookup,
    isError: isLookupError
  } = useLookupMember(receiverId.trim() ? receiverId : null);

  const transferMutation = useP2PTopupTransfer();

  const topUpBalance = memberData?.top_up_wallet_balance || 0;
  
  const handleSearch = () => {
    if (!receiverId.trim()) {
      toast.warning("Please enter a Member ID");
      return;
    }
    if (receiverId.trim() === memberId) {
      toast.warning("You cannot transfer to yourself");
      return;
    }
    triggerLookup();
  };

  const handleAmountChange = (e: any) => {
    const selectedAmount = e.target.value;
    if (selectedAmount !== "" && !/^\d*\.?\d*$/.test(selectedAmount)) {
      return;
    }
    setAmount(selectedAmount);
  };

  const handleTransfer = () => {
    if (!amount || amount === "0") return;
    if (!memberId || !lookupData?.Member_id) return;

    const transferAmount = parseFloat(amount);
    
    if (transferAmount > topUpBalance) {
      toast.warning("Insufficient Top-up Balance");
      return;
    }

    transferMutation.mutate(
      { senderId: memberId, receiverId: lookupData.Member_id, amount: amount },
      {
        onSuccess: () => {
          setAmount("");
          setReceiverId("");
          refetchMember();
        },
      }
    );
  };

  if (isMemberLoading) {
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
          Top-up Transfer
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
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
                Your Top-up Wallet Balance
              </Typography>
              <Typography
                variant="h4"
                sx={{ 
                  color: "#2c8786", 
                  mt: 1, 
                  fontWeight: "bold" 
                }}
              >
                ₹{Number(topUpBalance).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ maxWidth: '500px', margin: '0 auto', mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Transfer To
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <TextField
                label="Receiver Member ID"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                fullWidth
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#2c8786" },
                    "&.Mui-focused fieldset": { borderColor: "#2c8786" },
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleSearch}
                disabled={isLookupLoading || !receiverId.trim()}
                sx={{
                  borderColor: "#2c8786",
                  color: "#2c8786",
                  whiteSpace: "nowrap",
                  "&:hover": { borderColor: "#1f6362", backgroundColor: "rgba(44, 135, 134, 0.04)" }
                }}
              >
                {isLookupLoading ? <CircularProgress size={24} /> : "Search"}
              </Button>
            </Box>

            {isLookupError && (
              <Typography color="error" variant="body2">
                Member not found. Please check the ID.
              </Typography>
            )}

            {lookupData && lookupData.Member_id && !isLookupError && (
              <>
                <Box sx={{ p: 2, bgcolor: "#e6f4f1", borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ color: "#2c8786", fontWeight: "bold" }}>
                    Name: {lookupData.Name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {lookupData.Member_id}
                  </Typography>
                </Box>

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
                    parseFloat(amount) > topUpBalance
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
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletTransfer;
