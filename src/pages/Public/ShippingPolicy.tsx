import {
    Box,
    Container,
    Typography,
    Paper,
    Grid2 as Grid,
} from "@mui/material";
import {
    Truck,
    Clock,
    Package,
    Shield,
} from "lucide-react";
import Footer from "../../components/Footer/Footer";
import PublicHeader from "../../components/PublicHeader/PublicHeader";
import { useEffect } from "react";

const ShippingPolicy = () => {
    const primaryColor = "#2c8786";
    const gradientBg = "linear-gradient(135deg, #1a4847 0%, #2c8786 50%, #3aa9a7 100%)";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Truck size={32} />,
            title: "Digital Delivery",
            desc: "Instant access to digital products",
        },
        {
            icon: <Clock size={32} />,
            title: "Processing Time",
            desc: "0-24 hours for account activation",
        },
        {
            icon: <Package size={32} />,
            title: "Order Tracking",
            desc: "Real-time status in dashboard",
        },
        {
            icon: <Shield size={32} />,
            title: "Secure Service",
            desc: "100% safe & protected access",
        },
    ];

    const policySections = [
        {
            title: "1. Digital Services & Delivery",
            content: "JeevaHerbs primarily provides digital services, memberships, and software solutions. Since our core offerings are digital, no physical shipping is required for these services. Upon successful payment, your account/membership will be activated automatically or within a maximum of 24 hours.",
        },
        {
            title: "2. Physical Products (If Applicable)",
            content: "In the event that you purchase physical merchandise or promotional materials from our platform, the following shipping terms apply:\n• Orders are processed within 2-3 business days.\n• Delivery timelines vary between 5-7 business days depending on your location within India.\n• We partner with reputed courier services to ensure safe and timely delivery.",
        },
        {
            title: "3. Shipping Charges",
            content: "• Digital Products/Services: Free (No shipping charges apply).\n• Physical Products: Shipping charges, if any, will be calculated and displayed clearly at checkout before you complete your payment.",
        },
        {
            title: "4. Tracking Your Order",
            content: "For digital services, you can verify your active status directly from your User Dashboard. For any physical product orders, a tracking number and courier link will be provided to your registered email address and phone number once the order is dispatched.",
        },
        {
            title: "5. Delays & Issues",
            content: "While we strive to ensure timely delivery of all services and products, unforeseen circumstances (e.g., natural disasters, bank delays, or courier strikes) may cause delays. If you do not receive your digital activation within 24 hours or your physical product within 10 days, please contact our support team immediately.",
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
                    py: { xs: 6, md: 10 },
                    px: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: "bold",
                                mb: 3,
                                fontSize: { xs: "2rem", md: "3rem" },
                            }}
                        >
                            Shipping & Delivery Policy
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.9,
                                fontWeight: "normal",
                                lineHeight: 1.6,
                            }}
                        >
                            Information regarding the delivery of our digital services and physical products.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, py: { xs: 6, md: 8 }, backgroundColor: "#f8fdfd" }}>
                <Container maxWidth="lg">
                    {/* Features Grid */}
                    <Grid container spacing={3} sx={{ mb: 8 }}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: "100%",
                                        textAlign: "center",
                                        borderRadius: 3,
                                        border: "1px solid rgba(44, 135, 134, 0.1)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 10px 30px rgba(44, 135, 134, 0.1)",
                                            borderColor: primaryColor,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(44, 135, 134, 0.1)",
                                            color: primaryColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#1a4847" }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.desc}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Policy Content */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            border: "1px solid rgba(0,0,0,0.05)",
                            backgroundColor: "white",
                        }}
                    >
                        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
                            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}>
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </Typography>

                            {policySections.map((section, index) => (
                                <Box key={index} sx={{ mb: 4, "&:last-child": { mb: 0 } }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#1a4847",
                                            mb: 2,
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "text.secondary",
                                            lineHeight: 1.8,
                                            whiteSpace: "pre-line",
                                        }}
                                    >
                                        {section.content}
                                    </Typography>
                                </Box>
                            ))}

                            <Box
                                sx={{
                                    mt: 6,
                                    p: 3,
                                    backgroundColor: "rgba(44, 135, 134, 0.05)",
                                    borderRadius: 2,
                                    borderLeft: `4px solid ${primaryColor}`,
                                }}
                            >
                                <Typography variant="h6" sx={{ color: "#1a4847", mb: 1 }}>
                                    Need Assistance?
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    If you have any questions about our shipping and delivery policy, please contact our support team at <strong>support@jeevaherbs.com</strong> or call us at <strong>+91 9004478100</strong>.
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default ShippingPolicy;
