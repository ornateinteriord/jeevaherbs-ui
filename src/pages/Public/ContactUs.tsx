import {
    Box,
    Container,
    Typography,
    Paper,
    Grid2 as Grid,
    TextField,
    Button,
} from "@mui/material";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
} from "lucide-react";
import Footer from "../../components/Footer/Footer";
import PublicHeader from "../../components/PublicHeader/PublicHeader";
import { useState } from "react";

const ContactUs = () => {
    const primaryColor = "#2c8786";
    const gradientBg = "linear-gradient(135deg, #1a4847 0%, #2c8786 50%, #3aa9a7 100%)";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        alert("Thank you for contacting us. We will get back to you soon!");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    };

    const contactInfo = [
        {
            icon: <MapPin size={24} />,
            title: "Our Address",
            details: [
                "Shop No. G6, Door No. 6-2-83A1C",
                "Asha Chandra Trade Centre",
                "Opposite Court Road",
                "Udupi Taluk & Dist., Karnataka",
            ],
        },
        {
            icon: <Phone size={24} />,
            title: "Phone Numbers",
            details: [
                "+91 9004478100",
                "0820-7966887",
            ],
        },
        {
            icon: <Mail size={24} />,
            title: "Email Address",
            details: ["mscsociety100@gmail.com"],
        },
        {
            icon: <Clock size={24} />,
            title: "Business Hours",
            details: [
                "Monday - Saturday: 10:00 AM - 5:00 PM",
                "Sunday: Closed",
                "Bank Holidays: Closed",
            ],
        },
    ];

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", pt: 8 }}>
            <PublicHeader />
            {/* Hero Section */}
            <Box
                sx={{
                    background: gradientBg,
                    color: "white",
                    py: { xs: 3, md: 1 },
                    px: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <Phone size={64} />
                        </Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                fontSize: { xs: "1.75rem", md: "2.5rem" },
                            }}
                        >
                            Contact Us
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.9,
                                maxWidth: "700px",
                                mx: "auto",
                                fontSize: { xs: "1rem", md: "1.25rem" },
                            }}
                        >
                            We're here to help. Get in touch with us!
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
                <Grid container spacing={4}>
                    {/* Contact Information */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", mb: 3, color: primaryColor }}
                        >
                            Get In Touch
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: "#6b7280", lineHeight: 1.8 }}>
                            Have questions about our services, accounts, or loans? We're here to help!
                            Reach out to us through any of the following channels:
                        </Typography>

                        {contactInfo.map((info, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 2,
                                    borderRadius: 3,
                                    border: "1px solid #e0e0e0",
                                    display: "flex",
                                    gap: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        borderColor: primaryColor,
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                <Box sx={{ color: primaryColor }}>{info.icon}</Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 0.5 }}>
                                        {info.title}
                                    </Typography>
                                    {info.details.map((detail, idx) => (
                                        <Typography key={idx} variant="body2" sx={{ color: "#6b7280" }}>
                                            {detail}
                                        </Typography>
                                    ))}
                                </Box>
                            </Paper>
                        ))}
                    </Grid>

                    {/* Contact Form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: "bold", mb: 3, color: primaryColor }}
                            >
                                Send Us a Message
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Your Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Your Message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            startIcon={<Send size={20} />}
                                            sx={{
                                                background: gradientBg,
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                "&:hover": {
                                                    background: "linear-gradient(135deg, #1a1848 0%, #2a2773 50%, #3830a8 100%)",
                                                },
                                            }}
                                        >
                                            Send Message
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        {/* Additional Info */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mt: 3,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${primaryColor}08 0%, transparent 100%)`,
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                <strong>Note:</strong> For account-related queries, loan applications,
                                or deposit inquiries, please visit our branch with valid ID proof during
                                business hours. For urgent matters, please call our helpline numbers.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
};

export default ContactUs;
