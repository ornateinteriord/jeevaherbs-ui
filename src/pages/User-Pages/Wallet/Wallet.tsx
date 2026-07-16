import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataTable from "react-data-table-component";
import { useMediaQuery } from "@mui/material";
import {
  DASHBOARD_CUTSOM_STYLE,
  getWalletColumns,
} from "../../../utils/DataTableColumnsProvider";
import TokenService from "../../../api/token/tokenService";
import { useGetWalletOverview, useWalletWithdraw } from "../../../api/Memeber";

const Wallet = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [amount, setAmount] = useState("");
  const [deduction, setDeduction] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [optimisticBalance, setOptimisticBalance] = useState<number | null>(null);
  const [isWithdrawalAllowed, setIsWithdrawalAllowed] = useState<boolean>(true);
  // const [ setLoanStatusMessage] = useState<string>("");

  const memberId = TokenService.getMemberId();

  const {
    data: walletData,
    isLoading,
    refetch,
  } = useGetWalletOverview(memberId);

  const withdrawMutation = useWalletWithdraw(memberId);

  useEffect(() => {
    if (walletData?.data?.balance) {
      const balance = parseFloat(walletData.data.balance);
      setOptimisticBalance(balance);
    }

    // Check withdrawal allowance from API response
    if (walletData?.loanStatus) {
      setIsWithdrawalAllowed(walletData.loanStatus.isWithdrawalAllowed);
      // setLoanStatusMessage(walletData.loanStatus.message || "");
    }
  }, [walletData?.data?.balance, walletData?.loanStatus]);

  const handleAmountChange = (e: any) => {
    const selectedAmount = e.target.value;
    setAmount(selectedAmount);

    if (selectedAmount && selectedAmount !== "0") {
      const withdrawalAmount = parseFloat(selectedAmount);
      const calculatedDeduction = withdrawalAmount * 0.15;
      const calculatedNetAmount = withdrawalAmount - calculatedDeduction;

      setDeduction(calculatedDeduction);
      setNetAmount(calculatedNetAmount);
    } else {
      setDeduction(0);
      setNetAmount(0);
    }
  };

  const handleWithdraw = () => {
    if (!amount || amount === "0") {
      return;
    }

    if (!memberId) {
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    const currentBalance = optimisticBalance !== null ? optimisticBalance : parseFloat(walletData?.balance || 0);
    
    if (withdrawalAmount > currentBalance) {
      return;
    }

    if (withdrawalAmount < 500) {
      return;
    }

    if (withdrawalAmount > 1000) {
      return;
    }

    const newBalance = currentBalance - withdrawalAmount;
    setOptimisticBalance(newBalance);

    withdrawMutation.mutate(
      { memberId: memberId, amount: amount },
      {
        onSuccess: () => {
          setAmount("");
          setDeduction(0);
          setNetAmount(0);
          refetch();
        },
        onError: () => {
          // Revert optimistic update on error
          setOptimisticBalance(parseFloat(walletData?.balance || 0));
        }
      }
    );
  };

  const displayBalance = Math.max(0, optimisticBalance !== null ? optimisticBalance : parseFloat(walletData?.balance || 0));

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
        <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            "&.MuiAccordion-root": {
              backgroundColor: "#fff",
            },
          }}
        >
          <AccordionDetails>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    textAlign: "center",
                    border: `2px solid ${isWithdrawalAllowed ? "#2c8786" : "#ff9800"}`,
                    position: "relative",
                    opacity: isWithdrawalAllowed ? 1 : 0.7,
                  }}
                >
                  {withdrawMutation.isPending && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}
                    >
                      <CircularProgress size={20} sx={{ color: "#2c8786" }} />
                    </Box>
                  )}
                  <Typography variant="subtitle1" color="textSecondary">
                    Available Balance
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ 
                      color: isWithdrawalAllowed ? "#2c8786" : "#ff9800", 
                      mt: 1, 
                      fontWeight: "bold" 
                    }}
                  >
                    ₹{displayBalance.toFixed(2)}
                  </Typography>
                  {!isWithdrawalAllowed && (
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: "#ff9800", 
                        mt: 1, 
                        display: "block",
                        fontWeight: "bold"
                      }}
                    >
                      Withdrawal Disabled
                    </Typography>
                  )}
                  {withdrawMutation.isPending && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#2c8786", mt: 1, display: "block" }}
                    >
                      Updating...
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    textAlign: "center",
                    opacity: isWithdrawalAllowed ? 1 : 0.7,
                  }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Income
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#2c8786", mt: 1, fontWeight: "bold" }}
                  >
                    {walletData?.totalIncome ? `₹${walletData?.totalIncome}` : "₹0.00"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    textAlign: "center",
                    opacity: isWithdrawalAllowed ? 1 : 0.7,
                  }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Withdrawal
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#2c8786", mt: 1, fontWeight: "bold" }}
                  >
                    {walletData?.totalWithdrawal ? `₹${walletData?.totalWithdrawal}` : "₹0.00"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Withdrawal Section */}
        <Accordion
          defaultExpanded
          sx={{
            mt: isMobile ? 2 : 4,
            boxShadow: "none",
            "&.MuiAccordion-root": {
              backgroundColor: "#fff",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800",
              color: "#fff",
              "& .MuiSvgIcon-root": { color: "#fff" },
              minHeight: isMobile ? "48px" : "64px",
            }}
          >
            Withdrawal Request {!isWithdrawalAllowed && "(Temporarily Disabled)"}
          </AccordionSummary>
          <AccordionDetails>
            <form
              style={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <TextField
                label="Available Balance"
                value={`₹${displayBalance.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800" },
                  },
                }}
              />

              <FormControl fullWidth size="medium">
                <InputLabel>Withdrawal Amount</InputLabel>
                <Select
                  value={amount}
                  onChange={handleAmountChange}
                  label="Withdrawal Amount"
                  disabled={withdrawMutation.isPending || !isWithdrawalAllowed}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isWithdrawalAllowed ? "inherit" : "#ff9800",
                    },
                  }}
                >
                  <MenuItem value="0">
                    <em>Select Amount</em>
                  </MenuItem>
                  {[500, 1000].map((value) => (
                    <MenuItem 
                      key={value} 
                      value={value}
                      disabled={value > displayBalance || !isWithdrawalAllowed}
                    >
                      ₹{value} 
                      {value > displayBalance ? " (Insufficient Balance)" : ""}
                      {!isWithdrawalAllowed ? " (Withdrawal Disabled)" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Deduction Amount (15%)"
                value={`₹${deduction.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800" },
                  },
                }}
              />

              <TextField
                label="Net Amount Received"
                value={`₹${netAmount.toFixed(2)}`}
                fullWidth
                size="medium"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800" },
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Terms & Conditions:</strong>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 4, flexDirection: isMobile ? "column" : "row" }}>
                    <Box>
                      <Typography variant="body2">• 15% deduction applied</Typography>
                      <Typography variant="body2">• Minimum withdrawal: ₹500</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2">• Maximum withdrawal: ₹1000</Typography>
                      <Typography variant="body2">• One withdrawal per day allowed</Typography>
                    </Box>
                  </Box>
                  {!isWithdrawalAllowed && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#ff9800", 
                        fontWeight: "bold", 
                        mt: 1 
                      }}
                    >
                      • Withdrawal disabled due to unpaid loan from last Saturday
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  onClick={handleWithdraw}
                  disabled={
                    withdrawMutation.isPending || 
                    !amount || 
                    amount === "0" || 
                    parseFloat(amount) > displayBalance ||
                    !isWithdrawalAllowed
                  }
                  sx={{
                    backgroundColor: isWithdrawalAllowed ? "#2c8786" : "#ff9800",
                    minWidth: "120px",
                    "&:hover": { 
                      backgroundColor: isWithdrawalAllowed ? "#581c87" : "#f57c00" 
                    },
                    "&:disabled": { backgroundColor: "#cccccc" },
                  }}
                >
                  {withdrawMutation.isPending ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    isWithdrawalAllowed ? "Withdraw" : "Disabled"
                  )}
                </Button>
              </Box>
            </form>
          </AccordionDetails>
        </Accordion>

        {/* Transaction History */}
        <Accordion
          defaultExpanded
          sx={{
            mt: isMobile ? 2 : 4,
            boxShadow: "none",
            "&.MuiAccordion-root": {
              backgroundColor: "#fff",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: "#2c8786",
              color: "#fff",
              "& .MuiSvgIcon-root": { color: "#fff" },
              minHeight: isMobile ? "48px" : "64px",
            }}
          >
            Transaction History
          </AccordionSummary>
          <AccordionDetails>
            {walletData?.transactions && walletData.transactions.length > 0 ? (
              <DataTable
                columns={getWalletColumns()}
                data={walletData?.transactions}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={isMobile ? 10 : 25}
                paginationRowsPerPageOptions={
                  isMobile ? [10, 20, 50] : [25, 50, 100]
                }
                highlightOnHover
                responsive
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No transactions found
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Your transaction history will appear here
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Wallet;