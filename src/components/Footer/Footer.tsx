import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#1e1e1e", color: "#f5f5f5", pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight="bold" color="#4ade80" gutterBottom>
              JeevaHerbs
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8, mb: 2 }}>
              Dedicated to bringing the purest herbal remedies to the world. We combine ancient Ayurvedic wisdom with modern practices to empower your holistic wellness journey.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, ml: -1 }}>
              <IconButton sx={{ color: "white", "&:hover": { color: "#4ade80" } }}><Facebook /></IconButton>
              <IconButton sx={{ color: "white", "&:hover": { color: "#4ade80" } }}><Twitter /></IconButton>
              <IconButton sx={{ color: "white", "&:hover": { color: "#4ade80" } }}><Instagram /></IconButton>
              <IconButton sx={{ color: "white", "&:hover": { color: "#4ade80" } }}><LinkedIn /></IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography 
                component={Link} 
                to="/" 
                sx={{ color: "white", textDecoration: "none", opacity: 0.8, "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Home
              </Typography>
              <Typography 
                onClick={() => {
                  if (window.location.pathname !== "/") navigate("/");
                  setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                sx={{ color: "white", opacity: 0.8, cursor: "pointer", "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                About Us
              </Typography>
              <Typography 
                onClick={() => {
                  if (window.location.pathname !== "/") navigate("/");
                  setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                sx={{ color: "white", opacity: 0.8, cursor: "pointer", "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Contact Us
              </Typography>
              <Typography 
                component={Link} 
                to="/login" 
                sx={{ color: "white", textDecoration: "none", opacity: 0.8, "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Login
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography 
                component={Link} 
                to="/privacy-policy" 
                sx={{ color: "white", textDecoration: "none", opacity: 0.8, "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Privacy Policy
              </Typography>
              <Typography 
                component={Link} 
                to="/terms-conditions" 
                sx={{ color: "white", textDecoration: "none", opacity: 0.8, "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Terms & Conditions
              </Typography>
              <Typography 
                component={Link} 
                to="/refund-policy" 
                sx={{ color: "white", textDecoration: "none", opacity: 0.8, "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Refund & Cancellation Policy
              </Typography>
              <Typography 
                component={Link} 
                to="/shipping-policy" 
                sx={{ color: "white", textDecoration: "none", opacity: 0.8, "&:hover": { opacity: 1, color: "#4ade80" }, width: "fit-content" }}
              >
                Shipping & Delivery Policy
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Shop No. G6, Door No. 6-2-83A1C
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Asha Chandra Trade Centre, Udupi, KA
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Email: support@jeevaherbs.com
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Phone: +91 9004478100
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 6, pt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} JeevaHerbs. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
