import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useResetpassword } from "../../api/Auth";
import { LoadingComponent } from "../../App";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ResetPasswordMutation = useResetpassword();
  const { mutate, isPending } = ResetPasswordMutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (step === 1 && formData.email) {
        mutate({ email: formData.email });
        setStep((prev)=>prev+1);
      } else if (step === 2 && otp.length === 6) {
        mutate(
          { email: formData.email, otp },
          {
            onSuccess: () => {
              setStep((prev)=>prev+1);
            },
            onError: () => {
              setOtp("");
              setStep((prev)=>prev-1);
            },
          }
        );
      } else if (step === 3) {
        if (formData.password.length <= 5) {
          setErrorMessage("Password must be at least 6 characters*");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage("Passwords do not match");
          return;
        }
        mutate({ email: formData.email, password: formData.password, otp });
        setFormData({ email: "", password: "", confirmPassword: "" });
        setOtp("");
        setStep(1);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ padding: "2rem" }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{ color: "#2c8786", mb: 3, textAlign: "center" }}
            >
              Reset Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              {step >= 1 && (
                <TextField
                  required
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled={step > 1}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
              )}
              {!isPending && step >= 2 && (
                <MuiOtpInput
                  value={otp}
                  length={6}
                  onChange={setOtp}
                  autoFocus
                  TextFieldsProps={{
                    disabled: step > 2,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                      },
                      textAlign: "center",
                      "& .MuiInputBase-root": {
                        "&:hover fieldset": {
                          borderColor: "#2c8786",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2c8786",
                        },
                      },
                    },
                  }}
                />
              )}
              {!isPending && step === 3 && (
                <>
                  <TextField
                    required
                    id="password"
                    label="New Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#2c8786" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#2c8786",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2c8786",
                        },
                      },
                    }}
                  />

                  <TextField
                    required
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#2c8786" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#2c8786",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2c8786",
                        },
                      },
                    }}
                  />
                </>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#2c8786",
                  "&:hover": { backgroundColor: "#581c87" },
                }}
              >
                {step === 1
                  ? "Get OTP"
                  : step === 2
                  ? "Verify OTP"
                  : "Reset Password"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {isPending && <LoadingComponent />}
    </Container>
  );
};

export default ResetPassword;
