import { ChevronDown, Lock, LogOut, Menu, Settings, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import "./navbar.scss";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/use-auth";
import TokenService from "../../api/token/tokenService";
import { deepOrange } from "@mui/material/colors";
import {  useState } from "react";
import { useGetMemberDetails } from "../../api/Memeber";
import logoImg from "../../assets/jeeva_herbs.png";
//ok

const Navbar = ({
  toggelSideBar,
  shouldHide,
}: {
  toggelSideBar: () => void;
  shouldHide: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userRole } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Get logged-in userId from TokenService
  const userId = TokenService.getMemberId();

  // Fetch member details using your custom hook
  const { data: memberDetails } = useGetMemberDetails(userId);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
    TokenService.removeToken();
    window.dispatchEvent(new Event("storage"));
    setAnchorEl(null);
  };

  const isHomePage = location.pathname === "/";
  const isAdmin = userRole === "ADMIN";

  return (
    <>
      <AppBar
        position="fixed"
        className="navbar"
        style={{
          background: "#ffffff",
          color: "#333333",
          height: "65px",
          justifyContent: "center"
        }}
      >
        <Toolbar className="navbar-toolbar" sx={{ display: "flex", justifyContent: "space-between", width: "100%", px: { xs: 1, sm: 2 }, minHeight: "60px !important", position: "relative" }}>
          {!shouldHide && (
            <IconButton 
              onClick={() => toggelSideBar()}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <Menu color="#333333" />
            </IconButton>
          )}
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} 
            onClick={() => navigate("/")}
          >
            <Box
              component="img"
              src={logoImg}
              alt="JeevaHerbs Logo"
              sx={{ 
                height: { xs: 45, md: 55 }, 
                width: "auto", 
                objectFit: "contain",
                ml: { xs: 0, md: 2 },
                borderRadius: "8px"
              }}
            />
          </Box>
          
          {!isLoggedIn && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              <Typography 
                onClick={() => {
                  if (location.pathname !== "/") navigate("/");
                  setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                sx={{ color: "#333333", cursor: "pointer", fontWeight: 700, fontSize: "16px", "&:hover": { color: "#2c8187" } }}
              >
                About Us
              </Typography>
              <Typography 
                onClick={() => {
                  if (location.pathname !== "/") navigate("/");
                  setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                sx={{ color: "#333333", cursor: "pointer", fontWeight: 700, fontSize: "16px", "&:hover": { color: "#2c8187" } }}
              >
                Contact Us
              </Typography>
            </Box>
          )}

          <div style={{ marginLeft: "auto" }}>
            {isLoggedIn ? (
              <div className="admin-panel-container">
                {!isHomePage && isAdmin && (
                  <div className="admin-panel-content" onClick={handleMenuOpen}>
                    <Avatar
                      className="user-avatar"
                      alt="User Avatar"
                      sx={{ width: 40, height: 40, background: deepOrange[500] }}
                    >
                      {memberDetails?.Name
                        ? memberDetails.Name.charAt(0).toUpperCase()
                        : "U"}
                    </Avatar>
                    <Typography variant="body1" sx={{ color: "#333333", fontWeight: 500 }}>
                      {memberDetails?.Name || "Admin"}
                    </Typography>
                    <ChevronDown
                      color="#333333"
                      size={22}
                      style={{
                        transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                )}

                {!isHomePage && !isAdmin && (
                  <Button
                    className="logout-btn"
                    variant="ghost"
                    style={{ marginRight: "8px", fontSize: "50px",cursor:'pointer',borderRadius:'6px' }}
                    onClick={handleLogout}
                  >
                    <LogOut />
                  </Button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px", marginRight: "16px", alignItems: "center" }}>
                <MuiButton
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{ 
                    borderColor: "#2c8187", 
                    color: "#2c8187", 
                    fontWeight: "bold",
                    borderRadius: "20px",
                    px: { xs: 1.5, sm: 3 },
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    "&:hover": {
                      backgroundColor: "rgba(44,129,135,0.1)",
                      borderColor: "#2c8187"
                    }
                  }}
                >
                  Login
                </MuiButton>
              </div>
            )}
          </div>
        </Toolbar>

        {/* Dropdown Menu */}
        <MuiMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            className: Boolean(anchorEl) ? "custom-menu open" : "custom-menu",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <Avatar
              alt="Admin"
              sx={{
                width: 64,
                height: 64,
                marginBottom: "8px",
                background: deepOrange[500],
              }}
            >
              {memberDetails?.name
                ? memberDetails.name.charAt(0).toUpperCase()
                : ""}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {memberDetails?.name || "Member"}
            </Typography>
          </div>

          <Divider />

          <MenuItem onClick={handleMenuClose}>
            <User size={18} style={{ marginRight: "8px" }} />
            My Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/admin/update-password");
              setAnchorEl(null);
            }}
          >
            <Settings size={18} style={{ marginRight: "8px" }} />
            Account Settings
          </MenuItem>

          <Divider />

          <div className="admin-panel-menuitems">
            <MenuItem onClick={handleMenuClose} sx={{ display: "flex" }}>
              <Lock size={17} style={{ marginRight: "4px", color: "#2c8786" }} />
              Lock
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ display: "flex" }}>
              <LogOut
                size={18}
                style={{ marginRight: "4px", color: "red" }}
              />
              Logout
            </MenuItem>
          </div>
        </MuiMenu>
      </AppBar>
    </>
  );
};

export default Navbar;