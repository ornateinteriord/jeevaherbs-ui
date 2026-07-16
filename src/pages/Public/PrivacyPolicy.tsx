import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Shield, CheckCircle } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import PublicHeader from "../../components/PublicHeader/PublicHeader";

const PrivacyPolicy = () => {
    const primaryColor = "#2c8786";
    const gradientBg = "linear-gradient(135deg, #1a4847 0%, #2c8786 50%, #3aa9a7 100%)";

    const sections = [
        {
            title: "1. Information We Collect",
            content: `When you use our services or visit our website, we may collect the following information:`,
            items: [
                "Personal identification information (Name, PAN, Aadhaar, Date of Birth, Address)",
                "Contact information (Email address, phone number)",
                "Financial information (Bank account details, transaction history)",
                "KYC documents as required by RBI and cooperative society regulations",
                "Nominee and family member details for account operations",
                "Employment and income details for loan applications",
                "Device and browser information when using our online services",
            ],
        },
        {
            title: "2. How We Use Your Information",
            content: `Your information is used for the following purposes:`,
            items: [
                "Opening and maintaining member accounts (SB, CA, FD, RD, MIS, Pigmy)",
                "Processing loan applications and disbursements",
                "Facilitating online transactions and wallet services",
                "Compliance with RBI guidelines and cooperative society regulations",
                "Sending transaction alerts, account statements, and service notifications",
                "Fraud prevention and security monitoring",
                "Improving our services and member experience",
            ],
        },
        {
            title: "3. Payment Gateway & Transaction Security",
            content: `For online payments and transactions:`,
            items: [
                "We use Cashfree payment gateway for secure online transactions",
                "All payment data is encrypted using industry-standard SSL/TLS protocols",
                "We do not store your complete card details on our servers",
                "Payment processing is handled by PCI-DSS compliant payment partners",
                "Transaction data is retained as per RBI guidelines for audit purposes",
                "Two-factor authentication is mandatory for sensitive transactions",
            ],
        },
        {
            title: "4. Data Protection & Security",
            content: `We implement robust security measures to protect your data:`,
            items: [
                "End-to-end encryption for sensitive data transmission",
                "Secure data centers with restricted access",
                "Regular security audits and vulnerability assessments",
                "Employee training on data protection and privacy",
                "Incident response procedures for data breach management",
                "Compliance with IT Act 2000 and SPDI Rules 2011",
            ],
        },
        {
            title: "5. Information Sharing",
            content: `We may share your information only in the following circumstances:`,
            items: [
                "With regulatory authorities (RBI, Registrar of Cooperative Societies) as required by law",
                "With credit bureaus for credit assessment purposes",
                "With payment processors for transaction processing",
                "With auditors for statutory compliance",
                "In response to court orders or legal processes",
                "With your explicit consent for any other purpose",
            ],
        },
        {
            title: "6. Cookies & Tracking",
            content: `Our website uses cookies to:`,
            items: [
                "Remember your login session for security",
                "Analyze website usage patterns to improve services",
                "Personalize your experience on our platform",
                "You can disable cookies in your browser settings, but some features may not work properly",
            ],
        },
        {
            title: "7. Your Rights",
            content: `As a member, you have the following rights:`,
            items: [
                "Access your personal data held by us",
                "Request correction of inaccurate information",
                "Withdraw consent for marketing communications",
                "Request deletion of data (subject to regulatory retention requirements)",
                "Receive your data in a portable format",
                "Lodge complaints with the Registrar of Cooperative Societies",
            ],
        },
        {
            title: "8. Data Retention",
            content: `We retain your data as follows:`,
            items: [
                "Account data: For the duration of membership plus 8 years (as per RBI guidelines)",
                "Transaction records: Minimum 10 years for audit purposes",
                "Loan documents: Duration of loan plus 8 years after closure",
                "KYC documents: As per PMLA requirements",
                "Marketing preferences: Until you opt out",
            ],
        },
    ];

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", pt: 8 }}>
            <PublicHeader />
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
                            <Shield size={64} />
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
                            Privacy Policy
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
                            How we collect, use, and protect your information
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
                {/* Last Updated */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${primaryColor}08 0%, transparent 100%)`,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography variant="body1" sx={{ color: "#4b5563" }}>
                        <strong>Effective Date:</strong> January 1, 2025
                        <br />
                        <strong>Last Updated:</strong> January 9, 2026
                        <br /><br />
                        This Privacy Policy describes how <strong>Manipal Souharda Co-operative Society Ltd.</strong>
                        (Registration No: DRP | 6112 | 21-22) collects, uses, and protects the personal information
                        of our members and website visitors.
                    </Typography>
                </Paper>

                {/* Policy Sections */}
                {sections.map((section, index) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 3,
                            borderRadius: 3,
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}
                        >
                            {section.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, color: "#4b5563" }}>
                            {section.content}
                        </Typography>
                        <List dense>
                            {section.items.map((item, idx) => (
                                <ListItem key={idx} sx={{ py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircle size={16} color={primaryColor} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{
                                            variant: "body2",
                                            color: "#6b7280",
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}

                {/* Contact for Privacy */}
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
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}
                    >
                        9. Contact Us
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                        If you have any questions about this Privacy Policy or wish to exercise your rights,
                        please contact us:
                        <br /><br />
                        <strong>Manipal Souharda Co-operative Society Ltd.</strong><br />
                        Shop No. G6, Door No. 6-2-83A1C, Asha Chandra Trade Centre<br />
                        Opposite Court Road, Udupi Taluk & Dist., Karnataka<br />
                        Email: <strong>mscsociety100@gmail.com</strong><br />
                        Phone: <strong>+91 9004478100, 0820-7966887</strong>
                    </Typography>
                </Paper>

                <Divider sx={{ my: 4 }} />

                <Typography variant="body2" sx={{ textAlign: "center", color: "#6b7280" }}>
                    By using our services, you agree to this Privacy Policy.
                    Please also read our{" "}
                    <Link to="/terms-conditions" style={{ color: primaryColor, textDecoration: "none" }}>
                        Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/refund-policy" style={{ color: primaryColor, textDecoration: "none" }}>
                        Refund Policy
                    </Link>.
                </Typography>
            </Container>

            <Footer />
        </Box>
    );
};

export default PrivacyPolicy;
