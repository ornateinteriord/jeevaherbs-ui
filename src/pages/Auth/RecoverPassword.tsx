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
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRecoverpassword } from "../../api/Auth";
import { LoadingComponent } from "../../App";

const RecoverPassword = () => {
     const [formData, setFormData] = useState({
        email:""
      });
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      const RecoverPasswordMutation = useRecoverpassword()
      const { mutate, isPending} = RecoverPasswordMutation
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formData);
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
              Recover Password
            </Typography>
            <Typography
              component="h1"
              variant="body1"
              sx={{ color: "#2c8786", mb: 3, textAlign: "center" }}
            >
              Forgot your Password?
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <TextField
                required
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#2c8786",
                  "&:hover": { backgroundColor: "#581c87" },
                }}
              >
                Recover Password
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center",mt:-2 }}>
                or
                </Typography>
              <Typography variant="body2" sx={{ textAlign: "center", mt: -2 }}>
              <Link to="/reset-password" 
              style={{
                  color: "#2c8786",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}>
                Reset Password
              </Link>
            </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
       {isPending && <LoadingComponent />}
    </Container>
  );
};

export default RecoverPassword;
