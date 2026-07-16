import { Box, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PublicHeader = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1100,
                background: "linear-gradient(135deg, #1a4847 0%, #2c8786 100%)",
                py: 1.5,
                boxShadow: "0 2px 10px rgba(44, 135, 134, 0.3)",
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <Button
                            startIcon={<ArrowLeft size={18} />}
                            sx={{
                                color: "white",
                                textTransform: "none",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            Back to Login
                        </Button>
                    </Link>
                    <Box
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                        }}
                    >
                        Manipal Souharda Co-operative Society Ltd.
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default PublicHeader;
