import {
    Box,
    Container,
    Typography,
    Paper,
    Grid2 as Grid,
    Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
    Building2,
    Target,
    Users,
    Shield,
    TrendingUp,
    Award,
} from "lucide-react";
import Footer from "../../components/Footer/Footer";
import PublicHeader from "../../components/PublicHeader/PublicHeader";

const AboutUs = () => {
    const primaryColor = "#2c8786";
    const gradientBg = "linear-gradient(135deg, #1a4847 0%, #2c8786 50%, #3aa9a7 100%)";

    const features = [
        {
            icon: <Shield size={32} />,
            title: "Secure & Trusted",
            description: "Registered under Karnataka State Co-operative Societies Act with RBI compliance",
        },
        {
            icon: <Users size={32} />,
            title: "Member-Centric",
            description: "Dedicated to serving our members with transparent and ethical financial services",
        },
        {
            icon: <TrendingUp size={32} />,
            title: "Growth Oriented",
            description: "Helping members achieve financial goals through savings, deposits, and loans",
        },
        {
            icon: <Award size={32} />,
            title: "Excellence",
            description: "Committed to providing the best cooperative banking experience",
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
                            <Building2 size={64} />
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
                            About Us
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
                            Manipal Souharda Co-operative Society Ltd.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
                {/* Registration Details */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                        background: "linear-gradient(135deg, #f8f9ff 0%, #fff 100%)",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 3, color: primaryColor }}
                    >
                        <Target size={24} style={{ marginRight: "12px", verticalAlign: "middle" }} />
                        Who We Are
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: "#4b5563" }}>
                        <strong>Manipal Souharda Co-operative Society Ltd.</strong> is a registered cooperative
                        society operating under the Karnataka State Co-operative Societies Act. We are committed
                        to providing comprehensive financial services to our members, including savings accounts,
                        fixed deposits, recurring deposits, and various loan products.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: "#4b5563" }}>
                        Our society is registered with the Department of Co-operation, Government of Karnataka,
                        with Registration Number <strong>DRP | 6112 | 21-22</strong>. We operate with full
                        transparency and adhere to all regulatory guidelines.
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                <strong>Registration No:</strong> DRP | 6112 | 21-22
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                <strong>Registered Under:</strong> Karnataka State Co-operative Societies Act
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Our Services */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 3, color: primaryColor }}
                    >
                        Our Services
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                                💰 Savings & Deposits
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                                • Savings Bank (SB) Accounts<br />
                                • Current Accounts (CA)<br />
                                • Fixed Deposits (FD) with attractive interest rates<br />
                                • Recurring Deposits (RD)<br />
                                • Monthly Income Scheme (MIS)<br />
                                • Pigmy Deposits for daily savings
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                                🏦 Loan Products
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                                • Personal Loans<br />
                                • Gold Loans<br />
                                • Overdraft Facilities<br />
                                • Business Loans<br />
                                • Emergency Loans<br />
                                • Agricultural Loans
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Features Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: "100%",
                                    textAlign: "center",
                                    borderRadius: 3,
                                    border: "1px solid #e0e0e0",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 10px 30px rgba(44, 135, 134, 0.1)",
                                        borderColor: primaryColor,
                                    },
                                }}
                            >
                                <Box sx={{ color: primaryColor, mb: 2 }}>{feature.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Mission & Vision */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                        background: `linear-gradient(135deg, ${primaryColor}08 0%, transparent 100%)`,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 3, color: primaryColor }}
                    >
                        Our Mission
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#4b5563" }}>
                        To empower our members through accessible and affordable financial services,
                        promoting a culture of savings, mutual cooperation, and economic self-reliance.
                        We strive to be the most trusted cooperative society in the region, delivering
                        value to our members while maintaining the highest standards of integrity and
                        transparency.
                    </Typography>
                </Paper>

                {/* Quick Links */}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        For more information, please visit our{" "}
                        <Link to="/contact-us" style={{ color: primaryColor, textDecoration: "none" }}>
                            Contact Page
                        </Link>{" "}
                        or read our{" "}
                        <Link to="/terms-conditions" style={{ color: primaryColor, textDecoration: "none" }}>
                            Terms & Conditions
                        </Link>
                    </Typography>
                </Box>
            </Container>

            <Footer />
        </Box>
    );
};

export default AboutUs;
