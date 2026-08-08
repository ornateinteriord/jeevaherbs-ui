import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InventoryIcon from "@mui/icons-material/Inventory";
import UserContext from "../../../context/user/userContext";
import { useGetWalletOverview, useBuyPackage } from "../../../api/Memeber";
import { get } from "../../../api/Api";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";

const Activation: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { user } = useContext(UserContext);
  const { data: walletOverview } = useGetWalletOverview(user?.Member_id || "");
  const { mutate: buyPackage, isPending: isSubmitting } = useBuyPackage();

  const [formData, setFormData] = useState({
    targetMemberId: "",
  });

  const [targetName, setTargetName] = useState(user?.Name || "");
  const [isSearching, setIsSearching] = useState(false);
  const [isTargetActive, setIsTargetActive] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [purchasedPkgDetails, setPurchasedPkgDetails] = useState<any>(null);
  
  const [packageAmount, setPackageAmount] = useState<number>(5000);

  const topUpBalance = walletOverview?.top_up_wallet_balance || 0;

  useEffect(() => {
    if (!formData.targetMemberId) {
      setTargetName("");
      setIsTargetActive(false);
      return;
    }

    if (formData.targetMemberId === user?.Member_id) {
      setTargetName(user?.Name || "");
      setIsTargetActive(false);
      return;
    }

    const fetchName = async () => {
      setIsSearching(true);
      try {
        const res = await get(`/auth/get-sponsor/${formData.targetMemberId}`);
        if (res && res.success) {
          setTargetName(res.name || "Name not available");
          if (res.status === "active" || res.status === "Active") {
            setIsTargetActive(true);
            toast.error("User is already active");
          } else {
            setIsTargetActive(false);
          }
        } else {
          setTargetName("Member Not Found");
          setIsTargetActive(false);
        }
      } catch (e) {
        setTargetName("Member Not Found");
        setIsTargetActive(false);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchName, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.targetMemberId, user?.Member_id, user?.Name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.Member_id) return;

    if (targetName === "Member Not Found" || isTargetActive || isSearching) {
      toast.error("Please provide a valid Target Member ID");
      return;
    }

    if (topUpBalance < packageAmount) {
      toast.error("Insufficient Top-Up Wallet balance");
      return;
    }

    buyPackage(
      {
        buyerMemberId: user.Member_id,
        targetMemberId: formData.targetMemberId || user.Member_id,
      },
      {
        onSuccess: () => {
          setPurchasedPkgDetails({
            targetMemberId: formData.targetMemberId || user.Member_id,
            targetName: targetName,
            amount: packageAmount,
            packageName: "Standard Plan",
          });
          setSuccessDialogOpen(true);
          setFormData({ targetMemberId: "" });
          setTargetName("");
        },
      }
    );
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#2c8786",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2c8786",
      },
    },
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Card
        sx={{
          margin: isMobile ? "1rem" : "2rem",
          mt: 10,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <CardHeader
          title="Activation"
          sx={{
            bgcolor: "#2c8786",
            color: "#ffffff",
            py: 2,
          }}
          titleTypographyProps={{
            variant: "h6",
            fontWeight: 600,
          }}
        />
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <TextField
              label="Target Member ID"
              name="targetMemberId"
              value={formData.targetMemberId}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter member ID to activate"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />

            <TextField
              label="Target Name"
              value={targetName}
              fullWidth
              variant="outlined"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: targetName === "Member Not Found" ? "#ef4444" : "#2c8786" }} />
                  </InputAdornment>
                ),
                endAdornment: isSearching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null,
              }}
              sx={{
                ...inputStyles,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor:
                    targetName === "Member Not Found" ? "#ef4444" : "#333",
                },
              }}
            />

            <TextField
              select
              label="Package Amount (₹)"
              value={packageAmount}
              onChange={(e) => setPackageAmount(Number(e.target.value))}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      mt: 1,
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      borderRadius: "8px",
                    }
                  }
                }
              }}
              sx={inputStyles}
            >
              <MenuItem value={5000}>Package 5000</MenuItem>
              <MenuItem value={999}>Package 999</MenuItem>
            </TextField>

            <TextField
              label="Your Top-Up Wallet Balance (₹)"
              value={topUpBalance}
              fullWidth
              variant="outlined"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceWalletIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                ...inputStyles,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: topUpBalance < packageAmount ? "#ef4444" : "#333",
                  fontWeight: topUpBalance < packageAmount ? 600 : 400,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isSearching || isTargetActive || targetName === "Member Not Found" || topUpBalance < packageAmount}
              sx={{
                mt: 1,
                py: 1.5,
                bgcolor: "#2c8786",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "#226a6a",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              ) : (
                "Proceed to Buy"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: { xs: "300px", sm: "400px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            color: "#2c8786",
            fontWeight: 700,
          }}
        >
          Activation Successful!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="body1" sx={{ color: "#555", mb: 1 }}>
            Successfully activated package for:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 3 }}>
            {purchasedPkgDetails?.targetName} ({purchasedPkgDetails?.targetMemberId})
          </Typography>
          <Box
            sx={{
              bgcolor: "#f8fafc",
              p: 2,
              borderRadius: "8px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Package Amount
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#2c8786", mt: 0.5 }}
            >
              ₹{purchasedPkgDetails?.amount}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setSuccessDialogOpen(false)}
            sx={{
              bgcolor: "#2c8786",
              "&:hover": { bgcolor: "#226a6a" },
              px: 4,
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Activation;
