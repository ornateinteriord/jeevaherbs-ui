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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, ChevronDown } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import PublicHeader from "../../components/PublicHeader/PublicHeader";

const TermsConditions = () => {
    const primaryColor = "#2c8786";
    const gradientBg = "linear-gradient(135deg, #1a4847 0%, #2c8786 50%, #3aa9a7 100%)";

    const sections = [
        {
            title: "1. Definitions",
            items: [
                '"Society" refers to Manipal Souharda Co-operative Society Ltd.',
                '"Member" refers to any person who holds membership in the Society',
                '"Services" refers to all financial services offered including savings accounts, deposits, loans, and online transactions',
                '"Platform" refers to our website, mobile applications, and online banking services',
                '"Transaction" refers to any financial activity including deposits, withdrawals, transfers, and payments',
            ],
        },
        {
            title: "2. Membership Eligibility",
            items: [
                "Membership is open to individuals who are 18 years or above",
                "Applicants must provide valid KYC documents (Aadhaar, PAN, Address Proof)",
                "Membership requires purchase of minimum shares as per society bye-laws",
                "The Society reserves the right to accept or reject membership applications",
                "Corporate/institutional memberships are subject to additional documentation",
                "Members must provide nominee details at the time of account opening",
            ],
        },
        {
            title: "3. Account Terms",
            items: [
                "Minimum balance requirements apply to Savings Bank (SB) and Current Accounts (CA)",
                "Interest rates on deposits are subject to periodic revision by the Society",
                "Premature withdrawal of FD/RD may attract penalty as per prevailing rates",
                "Dormant accounts may be subject to reactivation charges",
                "Account statements will be provided monthly via email or physical copy",
                "Members must notify us immediately of any change in personal details",
            ],
        },
        {
            title: "4. Loan Terms & Conditions",
            items: [
                "Loan eligibility is based on membership tenure, savings history, and repayment capacity",
                "Interest rates on loans are fixed at the time of disbursement",
                "Late payment of EMI attracts penal interest as per prevailing rates",
                "Loan collateral/security requirements vary based on loan type and amount",
                "Guarantor(s) may be required for certain loan categories",
                "Prepayment of loans is allowed without any prepayment penalty",
                "Loan recovery will follow due process including legal action if necessary",
            ],
        },
        {
            title: "5. Online Services & Payments",
            items: [
                "Online transactions are processed through Cashfree payment gateway",
                "Members are responsible for maintaining confidentiality of login credentials",
                "Transaction limits apply as per the member's profile and RBI guidelines",
                "Failed transactions will be auto-reversed within 5-7 working days",
                "Service charges may apply for certain online transactions",
                "The Society is not liable for losses due to unauthorized access caused by member negligence",
                "Two-factor authentication is mandatory for sensitive transactions",
            ],
        },
        {
            title: "6. Wallet & Digital Payments",
            items: [
                "Wallet balance is subject to maximum limit as per RBI guidelines",
                "Wallet funds can be used for internal transfers and approved payments",
                "Adding money to wallet via payment gateway may attract processing fees",
                "Wallet-to-bank withdrawals are processed within 1-3 working days",
                "Inactive wallets for 12+ months may be suspended pending verification",
                "Disputed wallet transactions must be reported within 48 hours",
            ],
        },
        {
            title: "7. Agent/Advisor Services",
            items: [
                "Agents/Advisors are authorized representatives of the Society",
                "Collections made by agents are subject to receipt issuance",
                "Members should verify agent identity before making any payments",
                "The Society is not responsible for cash transactions without valid receipts",
                "Agent misconduct should be reported immediately to the Society",
                "Commission structure for agents is determined by the Society",
            ],
        },
        {
            title: "8. Regulatory Compliance",
            items: [
                "The Society operates under Karnataka State Co-operative Societies Act",
                "All operations comply with RBI guidelines for cooperative societies",
                "KYC/AML norms as per PMLA are mandatory for all members",
                "TDS is deducted on interest income as per Income Tax Act provisions",
                "Annual audits are conducted by authorized auditors",
                "Financial statements are presented at the Annual General Meeting",
            ],
        },
        {
            title: "9. Dispute Resolution",
            items: [
                "Disputes shall be resolved through internal grievance redressal first",
                "Complaints can be filed with the Registrar of Cooperative Societies",
                "Arbitration as per Karnataka Cooperative Societies Act shall apply",
                "Courts in Udupi, Karnataka shall have exclusive jurisdiction",
                "The Society's decision on disputes shall be final and binding",
            ],
        },
        {
            title: "10. Limitation of Liability",
            items: [
                "The Society shall not be liable for losses due to force majeure events",
                "Liability for online transaction failures is limited to the transaction amount",
                "The Society is not liable for third-party payment gateway failures",
                "Maximum liability is limited to direct damages excluding consequential losses",
                "Members indemnify the Society against claims arising from member misconduct",
            ],
        },
        {
            title: "11. Modification of Terms",
            items: [
                "The Society reserves the right to modify these terms at any time",
                "Changes will be communicated through the website and/or email",
                "Continued use of services implies acceptance of modified terms",
                "Major changes affecting member rights will be notified 30 days in advance",
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
                            <FileText size={64} />
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
                            Terms & Conditions
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
                            Please read these terms carefully before using our services
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
                {/* Introduction */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${primaryColor}08 0%, transparent 100%)`,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                        <strong>Effective Date:</strong> January 1, 2025
                        <br /><br />
                        These Terms and Conditions ("Terms") govern your membership and use of services
                        provided by <strong>Manipal Souharda Co-operative Society Ltd.</strong>
                        (Registration No: DRP | 6112 | 21-22). By becoming a member or using our services,
                        you agree to be bound by these Terms.
                    </Typography>
                </Paper>

                {/* Terms Sections as Accordions */}
                {sections.map((section, index) => (
                    <Accordion
                        key={index}
                        elevation={0}
                        sx={{
                            mb: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: "12px !important",
                            "&:before": { display: "none" },
                            "&.Mui-expanded": {
                                margin: "0 0 16px 0",
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ChevronDown color={primaryColor} />}
                            sx={{
                                borderRadius: "12px",
                                "&.Mui-expanded": {
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                },
                            }}
                        >
                            <Typography sx={{ fontWeight: "600", color: primaryColor }}>
                                {section.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                        </AccordionDetails>
                    </Accordion>
                ))}

                {/* Contact */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mt: 4,
                        borderRadius: 3,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}
                    >
                        12. Contact Information
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                        For any questions regarding these Terms, please contact us:
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
                    By using our services, you acknowledge that you have read and agree to these Terms.
                    Please also read our{" "}
                    <Link to="/privacy-policy" style={{ color: primaryColor, textDecoration: "none" }}>
                        Privacy Policy
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

export default TermsConditions;
