import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Grid, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const slideImages = [
  {
    url: "/images/milk_product.png",
    title: "Pure Ingredients",
    description: "Sourced from the finest natural herbs, ensuring you get the most potent and pure extracts for your health.",
  },
  {
    url: "/images/holistic_wellness.png",
    title: "Holistic Wellness",
    description: "Embrace a lifestyle of holistic well-being with ancient remedies formulated for modern everyday challenges.",
  },
  {
    url: "/images/pure_ingredients.png",
    title: "Sustainable Growth",
    description: "Join a community that supports sustainable agriculture and ethical harvesting of nature's greatest gifts.",
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
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              Welcome to JeevaHerbs
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "500", textShadow: "1px 1px 3px rgba(0,0,0,0.5)", color: "#4ade80" }}>
              {slideImages[currentSlide].title}
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, fontWeight: "normal", opacity: 0.9, textShadow: "1px 1px 3px rgba(0,0,0,0.5)", minHeight: "60px" }}>
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
      <Box id="about" sx={{ py: 10, px: 2, backgroundColor: "white" }}>
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
                About JeevaHerbs
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                We are dedicated to bringing the purest herbal remedies to the world. Our journey started with a simple belief: nature holds the key to holistic wellness. By combining ancient Ayurvedic wisdom with modern practices, we source, craft, and deliver the finest natural extracts to empower your health.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our community to access exclusive wellness resources, grow your network, and embark on a healthier lifestyle rooted in nature's greatest gifts.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 10, px: 2, backgroundColor: "#f8f5ff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h3" fontWeight="bold" color="#2c8786" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
                Have questions? We'd love to hear from you.
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
