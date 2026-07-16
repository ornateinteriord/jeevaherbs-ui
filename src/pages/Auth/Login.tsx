import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useLoginMutation } from "../../api/Auth";
import Footer from "../../components/Footer/Footer";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginMutation = useLoginMutation()
  const { mutate, isPending } = loginMutation

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", formData.username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }
    mutate(formData);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", mt: { xs: 2, md: 8 } }}>
      {/* Main content area - takes remaining space and centers the form */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
        <Container component="main" maxWidth="xs">
          <Card sx={{ width: "100%", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", backgroundColor: "#fff" }}>
            <CardContent sx={{ padding: "2rem" }}>
              <Typography component="h1" variant="h5" sx={{ color: "#2c8786", mb: 3, textAlign: "center" }}>
                Sign In
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#2c8786',
                        '&.Mui-checked': {
                          color: '#2c8786',
                        },
                      }}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                  sx={{ mt: -1, mb: -1 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isPending}
                  sx={{
                    backgroundColor: '#2c8786',
                    '&:hover': {
                      backgroundColor: '#236d6c',
                    },
                    mt: 1,
                    py: 1.5,
                    fontWeight: 'bold'
                  }}
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Link to="/recover-password" style={{ color: "#2c8786", textDecoration: "none" }}>
                    Forgot password?
                  </Link>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2">
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#2c8786", textDecoration: "none", fontWeight: "bold" }}>
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
      {/* Footer at the bottom */}
      <Footer />
    </Box>
  );
};

export default Login;