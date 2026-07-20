import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Grid, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const slideImages = [
  {
    url: "/images/milk_product.png",
    title: "Healthy Living",
    description: "Nature's care for your wellness. 100% Herbal Wellness.",
  },
  {
    url: "/images/holistic_wellness.png",
    title: "Smart Income",
    description: "Along with quality products, Jeeva Herbs offers a rewarding business opportunity.",
  },
  {
    url: "/images/pure_ingredients.png",
    title: "Better Future",
    description: "Grow through referrals, team building, and repeat purchases for sustainable income.",
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Full Screen Hero Slider */}
      <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        
        {/* Slider Backgrounds */}
        {slideImages.map((slide, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${slide.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              zIndex: 1,
            }}
          >
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)" }} />
          </Box>
        ))}

        {/* Overlaid Text and Buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            px: 2,
            pt: 8 
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "2.3rem", md: "4rem" }, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              JEEVA HERBS
            </Typography>
            <Typography variant="h4" sx={{fontSize:{xs:"1.76rem", md:"4rem"}, mb: {xs:1, md:2}, fontWeight: "bold", textShadow: "1px 1px 3px rgba(0,0,0,0.5)", color: "#fff" }}>
              Herbal Wellness Business Plan
            </Typography>
            <Typography variant="h5" sx={{ mb: {xs:1, md:2}, fontWeight: "500", textShadow: "1px 1px 3px rgba(0,0,0,0.5)", color: "#4ade80" }}>
              {slideImages[currentSlide].title}
            </Typography>
            <Typography variant="h6" sx={{ mb: {xs:3, md:6}, fontWeight: "normal", opacity: 0.9, textShadow: "1px 1px 3px rgba(0,0,0,0.5)", minHeight: "60px" }}>
              {slideImages[currentSlide].description}
            </Typography>
            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: "#299592",
                  color: "white",
                  fontWeight: "bold",
                  px: 5,
                  py: 1.5,
                  borderRadius: "30px",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 14px 0 rgba(41, 149, 146, 0.39)",
                  "&:hover": {
                    backgroundColor: "#236d6c",
                  },
                  textTransform: "capitalize"
                }}
              >
                Login to Account
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                startIcon={<PersonAddIcon />}
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontWeight: "bold",
                  px: 5,
                  py: 1.5,
                  borderRadius: "30px",
                  fontSize: "1.1rem",
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "#4ade80",
                    color: "#4ade80",
                    borderWidth: "2px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                  textTransform: "capitalize"
                }}
              >
                Register Now
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: {xs:2, md:10}, px: 2, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/images/about_us_herbs.png"
                alt="About JeevaHerbs"
                sx={{ width: "100%", borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", objectFit: "cover", height: { xs: "300px", md: "450px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" color="#2c8786" gutterBottom>
                ABOUT US
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                Jeeva Herbs is a wellness-focused company committed to providing herbal products that promote healthier lifestyles through natural ingredients. Our products are crafted with carefully selected herbs to support relaxation, comfort, and everyday wellness.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: "1.1rem" }}>
                Along with quality products, Jeeva Herbs also offers a rewarding business opportunity where members can grow through referrals, team building, and repeat purchases.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ backgroundColor: "#f8f5ff", p: 3, borderRadius: 2, height: "100%" }}>
                    <Typography variant="h5" fontWeight="bold" color="#2c8786" gutterBottom>
                      Our Vision
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      To become one of India's most trusted herbal wellness companies by delivering natural products together with sustainable income opportunities.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ backgroundColor: "#f0fdf4", p: 3, borderRadius: 2, height: "100%" }}>
                    <Typography variant="h5" fontWeight="bold" color="#2c8786" gutterBottom>
                      Our Mission
                    </Typography>
                    <Box component="ul" sx={{ color: "text.secondary", pl: 2, '& li': { mb: 1, fontSize: "0.95rem" } }}>
                      <li>Promote herbal wellness.</li>
                      <li>Build a strong business community.</li>
                      <li>Deliver quality products.</li>
                      <li>Support financial growth.</li>
                      <li>Create long-term relationships.</li>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Jeeva Herbs Section */}
      <Box sx={{ py: {xs:2, md:6}, px: 2, background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)", position: "relative", overflow: "hidden" }}>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#2c8786", mb: 1 }}>
              WHY CHOOSE JEEVA HERBS?
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#b48600", fontWeight: "bold", letterSpacing: 1 }}>
              NATURAL CARE • SMART INCOME • BETTER FUTURE
            </Typography>
          </Box>
          <Grid container spacing={2} justifyContent="center">
            {[
              "Premium Herbal Product",
              "Cashback Benefits",
              "Affordable Package",
              "Fast Wallet System",
              "Simple Business Plan",
              "Team Growth",
              "Daily Income Opportunities",
              "Repeat Income"
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1.5, 
                    backgroundColor: "white", 
                    p: 1.5, 
                    borderRadius: "12px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    border: "1px solid transparent",
                    transition: "all 0.2s ease",
                    cursor: "default",
                    "&:hover": {
                      borderColor: "#4ade80",
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 20px rgba(44, 135, 134, 0.1)"
                    }
                  }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    width: 32, 
                    height: 32, 
                    borderRadius: "50%", 
                    backgroundColor: "#e6f4f1",
                    flexShrink: 0
                  }}>
                    <CheckCircleIcon sx={{ color: "#2c8786", fontSize: 20 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold" color="#333" sx={{ lineHeight: 1.2 }}>
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Box sx={{ 
              backgroundColor: "#2c8786", 
              color: "white", 
              py: 0.5, 
              px: 3, 
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(44,135,134,0.2)",
              border: "2px solid #eab308"
            }}>
              <Typography variant="body2" fontWeight="bold">
                ★ NATURAL • SAFE • EFFECTIVE ★
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 10, px: 2, backgroundColor: "#f8f5ff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h3" fontWeight="bold" color="#2c8786" gutterBottom sx={{fontSize:{xs:"2.3rem", md:"4rem"}}}>
                GET IN TOUCH
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: {xs:2, md:6}, fontSize:{xs:"1rem", md:"4rem"} }}>
                Have questions about our premium herbal products or simple business plan? We're here to help you build a better future!
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="#2c8786">Our Address</Typography>
                  <Typography variant="body1" color="text.secondary">123 Herbal Avenue, Wellness City, 45678</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="#2c8786">Email Us</Typography>
                  <Typography variant="body1" color="text.secondary">support@jeevaherbs.com</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="#2c8786">Call Us</Typography>
                  <Typography variant="body1" color="text.secondary">+1 (800) 123-4567</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Box sx={{ backgroundColor: "white", p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Your Name" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Your Email" variant="outlined" fullWidth />
                    </Grid>
                  </Grid>
                  <TextField label="Subject" variant="outlined" fullWidth />
                  <TextField label="Message" variant="outlined" multiline rows={5} fullWidth />
                  <Button variant="contained" size="large" sx={{ backgroundColor: "#2c8786", "&:hover": { backgroundColor: "#236d6c" }, alignSelf: "flex-start", px: 6, py: 1.5, borderRadius: "30px", fontWeight: "bold" }}>
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
