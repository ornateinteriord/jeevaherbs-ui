import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Home Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is where you can find the latest updates and information.
      </Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: "1rem",
          justifyContent: "center",
          mt: 2,
        }}
      >
      </Box>
    </Box>
  );
};

export default Home;
