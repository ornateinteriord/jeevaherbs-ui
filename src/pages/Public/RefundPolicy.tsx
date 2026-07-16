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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { RotateCcw, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import PublicHeader from "../../components/PublicHeader/PublicHeader";

const RefundPolicy = () => {
    const primaryColor = "#2c8786";
    const gradientBg = "linear-gradient(135deg, #1a4847 0%, #2c8786 50%, #3aa9a7 100%)";

    const refundTimelines = [
        { type: "Failed UPI/Card Payment", timeline: "5-7 working days", mode: "Original payment method" },
        { type: "Failed Wallet Top-up", timeline: "3-5 working days", mode: "Bank account/Original method" },
        { type: "Duplicate Transaction", timeline: "7-10 working days", mode: "Original payment method" },
        { type: "Cancelled Service Request", timeline: "7-14 working days", mode: "Bank account/Wallet" },
        { type: "FD/RD Premature Closure", timeline: "3-5 working days", mode: "SB Account" },
        { type: "Loan Prepayment Excess", timeline: "3-5 working days", mode: "SB Account" },
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
                            <RotateCcw size={64} />
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
                            Refund & Cancellation Policy
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
                            Our commitment to transparent and fair refund processes
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
                        This Refund and Cancellation Policy outlines the terms for refunds and cancellations
                        of services provided by <strong>Manipal Souharda Co-operative Society Ltd.</strong>
                        (Registration No: DRP | 6112 | 21-22). We are committed to ensuring fair and
                        transparent refund processes for all our members.
                    </Typography>
                </Paper>

                {/* Important Notice */}
                <Alert
                    severity="info"
                    icon={<AlertTriangle size={24} />}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        "& .MuiAlert-icon": { color: primaryColor },
                    }}
                >
                    <Typography variant="body2">
                        <strong>Important:</strong> All refund requests are processed through our secure
                        banking system. Refunds for online transactions are processed via the Cashfree
                        payment gateway in accordance with RBI guidelines.
                    </Typography>
                </Alert>

                {/* Online Payment Refunds */}
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
                        1. Online Payment Refunds
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: "#4b5563" }}>
                        For transactions made through our online platform using Cashfree payment gateway:
                    </Typography>
                    <List dense>
                        {[
                            "Failed transactions are automatically reversed within 5-7 working days",
                            "Refunds are credited to the original payment source (bank account, card, UPI)",
                            "For wallet transactions, refunds may be credited to the member's SB account",
                            "Members will receive SMS/email confirmation once refund is processed",
                            "If refund is delayed beyond 10 days, contact our support team with transaction ID",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Wallet Refunds */}
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
                        2. Wallet Transactions
                    </Typography>
                    <List dense>
                        {[
                            "Failed wallet top-ups are refunded within 3-5 working days",
                            "Wallet-to-wallet transfer failures are reversed immediately",
                            "Wallet balance can be withdrawn to linked bank account anytime",
                            "No charges for wallet balance withdrawal to SB account",
                            "External bank withdrawals may take 1-3 working days",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Deposit Cancellations */}
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
                        3. Deposit Account Cancellation/Premature Closure
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1, mt: 2 }}>
                        Fixed Deposit (FD):
                    </Typography>
                    <List dense>
                        {[
                            "Premature withdrawal allowed after 3 months from deposit date",
                            "Interest penalty of 1-2% below the contracted rate applies",
                            "No penalty for withdrawal after 50% of tenure completed",
                            "Proceeds credited to SB account within 3 working days",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1, mt: 3 }}>
                        Recurring Deposit (RD):
                    </Typography>
                    <List dense>
                        {[
                            "Premature closure allowed after 6 installments",
                            "Reduced interest rate applies for premature closure",
                            "Partial withdrawal not permitted",
                            "Full maturity amount paid if completed tenure",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1, mt: 3 }}>
                        Pigmy Deposit:
                    </Typography>
                    <List dense>
                        {[
                            "Withdrawal allowed after 6 months from opening",
                            "Interest calculated at SB rate for premature closure",
                            "Full maturity interest paid on completion",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Loan Cancellation */}
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
                        4. Loan Cancellation & Prepayment
                    </Typography>
                    <List dense>
                        {[
                            "Loan cancellation allowed within 7 days of disbursement (no prepayment penalty)",
                            "Prepayment of loan is allowed anytime without any penalty charges",
                            "Excess amount collected during prepayment refunded within 3 working days",
                            "Foreclosure charges: NIL for all loan types",
                            "Part-prepayment allowed with minimum 3 EMI equivalent amount",
                            "Collateral/security released within 15 days of loan closure",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Membership Cancellation */}
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
                        5. Membership Cancellation
                    </Typography>
                    <List dense>
                        {[
                            "Members can request withdrawal of membership at any time",
                            "Share capital refunded after adjustment of outstanding dues",
                            "Refund processed within 30 days of approval by the Board",
                            "Membership fee and admission fee are non-refundable",
                            "All deposits must be closed before membership withdrawal",
                            "Outstanding loans must be cleared before membership cancellation",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CheckCircle size={16} color={primaryColor} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Refund Timeline Table */}
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
                        sx={{ fontWeight: "bold", mb: 3, color: primaryColor, display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <Clock size={24} /> 6. Refund Timeline Summary
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: `${primaryColor}10` }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>Transaction Type</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Processing Time</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Refund Mode</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {refundTimelines.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.timeline}</TableCell>
                                        <TableCell>{row.mode}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Non-Refundable Items */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid #ef4444",
                        background: "#fef2f2",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 3, color: "#dc2626" }}
                    >
                        7. Non-Refundable Items
                    </Typography>
                    <List dense>
                        {[
                            "Membership admission fee",
                            "Processing fees for loan applications",
                            "Service charges for account statements, certificates",
                            "Penal interest on delayed payments",
                            "Legal and recovery charges",
                            "Transaction convenience fees (payment gateway charges)",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                    <AlertTriangle size={16} color="#dc2626" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#6b7280" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* How to Request Refund */}
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
                        8. How to Request a Refund
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: "#4b5563" }}>
                        To request a refund, please follow these steps:
                    </Typography>
                    <List>
                        {[
                            "For online transactions: Email us at mscsociety100@gmail.com with Transaction ID, Date, Amount, and issue description",
                            "For deposit closures: Visit our branch with passbook and ID proof",
                            "For loan prepayment: Submit written application at the branch",
                            "For membership withdrawal: Submit Form as per bye-laws with required documents",
                        ].map((item, idx) => (
                            <ListItem key={idx} sx={{ py: 1 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            backgroundColor: primaryColor,
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.875rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {idx + 1}
                                    </Box>
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    primaryTypographyProps={{ variant: "body2", color: "#4b5563" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Contact */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${primaryColor}08 0%, transparent 100%)`,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}
                    >
                        Contact for Refund Queries
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.8 }}>
                        <strong>Manipal Souharda Co-operative Society Ltd.</strong><br />
                        Shop No. G6, Door No. 6-2-83A1C, Asha Chandra Trade Centre<br />
                        Opposite Court Road, Udupi Taluk & Dist., Karnataka<br />
                        Email: <strong>mscsociety100@gmail.com</strong><br />
                        Phone: <strong>+91 9004478100, 0820-7966887</strong><br /><br />
                        <em>Office Hours: Monday to Saturday, 10:00 AM to 5:00 PM</em>
                    </Typography>
                </Paper>

                <Divider sx={{ my: 4 }} />

                <Typography variant="body2" sx={{ textAlign: "center", color: "#6b7280" }}>
                    This policy is subject to change. Please check regularly for updates.
                    Also read our{" "}
                    <Link to="/terms-conditions" style={{ color: primaryColor, textDecoration: "none" }}>
                        Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" style={{ color: primaryColor, textDecoration: "none" }}>
                        Privacy Policy
                    </Link>.
                </Typography>
            </Container>

            <Footer />
        </Box>
    );
};

export default RefundPolicy;
