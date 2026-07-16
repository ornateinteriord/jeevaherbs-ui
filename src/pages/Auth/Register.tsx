import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Autocomplete,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import DomainIcon from "@mui/icons-material/Domain";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ExploreIcon from "@mui/icons-material/Explore";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";

import "./Register.scss";
import { useGetSponserRef, useSignupMutation } from "../../api/Auth";
import { useGetStates, useGetDistricts, useGetCitiesAndTaluks } from "../../api/Location";
import { LoadingComponent } from "../../App";



const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const refCode = searchParams.get("ref") || "";
  const [formData, setFormData] = useState<Record<string, string>>({
    Sponsor_code: "",
    Sponsor_name: "",
    gender: "",
    Name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileno: "",
    pincode: "",
    state: "",
    district: "",
    city: "",
    taluk: "",
  });
  
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [genderError, setGenderError] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<{memberId: string; password: string}>({
    memberId: '',
    password: ''
  });
  
  const { 
    data: sponsorData,
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetSponserRef(formData.Sponsor_code);

  const { data: states } = useGetStates();
  const { data: districts } = useGetDistricts(formData.state);
  const { data: citiesAndTaluks } = useGetCitiesAndTaluks(formData.state, formData.district);

  const stateOptions = states || [];
  const districtOptions = districts || [];
  const cityOptions = citiesAndTaluks?.cities || [];
  const talukOptions = citiesAndTaluks?.taluks || [];

  // Auto-populate sponsor code from URL when component mounts
  useEffect(() => {
    if (refCode) {
      setFormData(prev => ({
        ...prev,
        Sponsor_code: refCode
      }));
    }
  }, [refCode]);

  // Fetch sponsor details when sponsor code changes
  useEffect(() => {
    if (formData.Sponsor_code && formData.Sponsor_code.length >= 5) {
      refetch();
    }
  }, [formData.Sponsor_code, refetch]);

  // Update sponsor name when sponsor data is fetched
  useEffect(() => {
    if (sponsorData && sponsorData.name) {
      setFormData(prev => ({
        ...prev,
        Sponsor_name: sponsorData.name
      }));
    } else if (isError) {
      // Clear sponsor name if there's an error
      setFormData(prev => ({
        ...prev,
        Sponsor_name: ""
      }));
    }
  }, [sponsorData, isError]);

  const sponsorError = isError && error instanceof Error ? error.message : "";

  const handleSponsorCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSponsorCode = e.target.value;
    setFormData(prev => ({
      ...prev,
      Sponsor_code: newSponsorCode,
      Sponsor_name: "" // Clear sponsor name when code changes
    }));
  };

  const handleSponsorCodeBlur = () => {
    if (formData.Sponsor_code && formData.Sponsor_code.length >= 5) {
      refetch();
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setErrorMessage(""); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevData => ({
      ...prevData,
      gender: e.target.value,
    }));
    setGenderError(false);
  };

  const { mutate, isPending } = useSignupMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.gender) {
      setGenderError(true);
      return;
    }
    
    if (!formData.password || formData.password.length <= 5) {
      setErrorMessage("Password must be at least 6 characters*");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!formData.Sponsor_code || formData.Sponsor_code.length < 5) {
      setErrorMessage("Valid sponsor code is required");
      return;
    }

    if (!formData.Sponsor_name) {
      setErrorMessage("Please enter a valid sponsor code");
      return;
    }

    try {
      // Create the final data object with the required structure
      const finalData = {
        sponsor_id: formData.Sponsor_code,  // Using Sponsor_code as sponsor_id
        Sponsor_code: formData.Sponsor_code,
        Sponsor_name: formData.Sponsor_name,
        ...formData // Spread all other form data
      };

      mutate(finalData, {
        onSuccess: (response) => {
          if (response.success) {
            setRegistrationData({
              memberId: response.user.Member_id, 
              password: formData.password
            });
            setSuccessDialogOpen(true);
          }
        },
        onError: (error) => {
          setErrorMessage(error.response?.data?.message || "Registration failed");
        }
      });

    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
    // Navigate to login after closing dialog
    navigate("/login");
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "66px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <CardContent sx={{ padding: "2rem" }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{ color: "#2c8786", mb: 3, textAlign: "center" }}
            >
              Create Account
            </Typography>
            
            <Typography
              variant="body1"
              sx={{ color: "#2c8786", marginBottom: "15px", width: "50%" }}
            >
              Referral details
            </Typography>
            
            <Box
              component="form"
              onSubmit={handleSubmit}
              className="reg-textfield-container"
            >
              <Box className="textfield-content">
                <TextField
                  required
                  name="Sponsor_code"
                  label="Sponsor Code"
                  placeholder="Sponsor code"
                  value={formData.Sponsor_code}
                  onChange={handleSponsorCodeChange}
                  onBlur={handleSponsorCodeBlur}
                  error={(formData.Sponsor_code.length > 0 && formData.Sponsor_code.length < 5) || (formData.Sponsor_code.length >= 5 && !!sponsorError)}
                  helperText={
                    formData.Sponsor_code.length > 0 && formData.Sponsor_code.length < 5
                      ? "Sponsor code must be at least 5 characters."
                      : formData.Sponsor_code.length >= 5 && sponsorError
                      ? sponsorError
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />

                <TextField
                  required
                  name="Sponsor_name"
                  label="Sponsor Name"
                  placeholder="Sponsor Name"
                  value={formData.Sponsor_name}
                  onChange={handleChange}
                  disabled={true} // Make it read-only since it's auto-filled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
              </Box>
              
              <Box className="textfield-content">
                <TextField
                  required
                  id="Name"
                  label="Full Name"
                  name="Name"
                  autoComplete="Name"
                  autoFocus
                  placeholder="Enter your full name"
                  value={formData.Name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
                
                <TextField
                  required
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
                
                <TextField
                  required
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
                
                <TextField
                  required
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errorMessage} 
                  helperText={errorMessage} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
                
                <TextField
                  required
                  label="Mobile Number"
                  name="mobileno"
                  type="tel"
                  autoComplete="mobileno"
                  placeholder="Enter your number"
                  value={formData.mobileno}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />
                
                <TextField
                  required
                  label="Pin Code"
                  name="pincode"
                  autoComplete="pincode"
                  placeholder="Enter your pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c8786",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2c8786",
                      },
                    },
                  }}
                />

                <Autocomplete
                  options={stateOptions}
                  value={formData.state || null}
                  onChange={(_, newValue) => {
                    handleChange({ target: { name: 'state', value: newValue || '' } } as any);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      name="state"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapIcon sx={{ color: '#2c8786' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#2c8786' },
                          '&.Mui-focused fieldset': { borderColor: '#2c8786' }
                        }
                      }}
                    />
                  )}
                />

                <Autocomplete
                  options={districtOptions}
                  value={formData.district || null}
                  onChange={(_, newValue) => {
                    handleChange({ target: { name: 'district', value: newValue || '' } } as any);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="District"
                      name="district"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <DomainIcon sx={{ color: '#2c8786' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#2c8786' },
                          '&.Mui-focused fieldset': { borderColor: '#2c8786' }
                        }
                      }}
                    />
                  )}
                />

                <Autocomplete
                  options={cityOptions}
                  value={formData.city || null}
                  onChange={(_, newValue) => {
                    handleChange({ target: { name: 'city', value: newValue || '' } } as any);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      name="city"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationCityIcon sx={{ color: '#2c8786' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#2c8786' },
                          '&.Mui-focused fieldset': { borderColor: '#2c8786' }
                        }
                      }}
                    />
                  )}
                />

                <Autocomplete
                  freeSolo
                  options={talukOptions}
                  value={formData.taluk || ''}
                  onChange={(_, newValue) => {
                    handleChange({ target: { name: 'taluk', value: newValue || '' } } as any);
                  }}
                  onInputChange={(_, newInputValue) => {
                    handleChange({ target: { name: 'taluk', value: newInputValue } } as any);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Taluk"
                      name="taluk"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <ExploreIcon sx={{ color: '#2c8786' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#2c8786' },
                          '&.Mui-focused fieldset': { borderColor: '#2c8786' }
                        }
                      }}
                    />
                  )}
                />
                
                <FormControl
                  error={!!genderError}
                  className="form-control"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <FormLabel className="form-label" sx={{ color: "#2c8786!important" }}>
                    <WcIcon sx={{ color: "#2c8786" }} />
                    Gender:
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleRadioChange}
                    className="radio-grp"
                  >
                    <FormControlLabel
                      value="Male"
                      className="form-control-label"
                      control={
                        <Radio sx={{ "&.Mui-checked": { color: "#2c8786" } }} />
                      }
                      label="Male"
                    />
                    <FormControlLabel
                      className="form-control-label"
                      value="Female"
                      control={
                        <Radio sx={{ "&.Mui-checked": { color: "#2c8786" } }} />
                      }
                      label="Female"
                    />
                  </RadioGroup>
                </FormControl> 
                
                {genderError && (
                  <FormHelperText sx={{color:"#d32f2f",marginTop:"-20px"}}>  
                    Please select your gender*
                  </FormHelperText>
                )}
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      sx={{ color: "#2c8786" }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "#2c8786" }}>
                      I accept the Terms and Conditions
                    </Typography>
                  }
                  className="FormControlLabel"
                />
                
                <Box className="btn-container">
                  <Button
                    type="submit"
                    variant="contained"
                    className="signup-btn"
                    disabled={!isChecked || isPending}
                    sx={{
                      backgroundColor: "#2c8786",
                      marginRight: "130px",
                      "&:hover": {
                        backgroundColor: "#581c87",
                      },
                    }}
                  >
                    {isPending ? "Registering..." : "Register"}
                  </Button>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
              Have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#2c8786",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            </Typography>
            
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
              <Link 
                to="/recover-password" 
                style={{
                  color: "#2c8786",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Recover Password
              </Link>
            </Typography>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="registration-success-dialog"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle 
            id="registration-success-dialog"
            sx={{ 
              backgroundColor: '#2c8786', 
              color: 'white',
              textAlign: 'center'
            }}
          >
            Registration Successful!
          </DialogTitle>
          <DialogContent sx={{ padding: '2rem' }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              New Member Created Successfully
            </Typography>
            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '1.5rem', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Member ID:</strong> {registrationData.memberId}
              </Typography>
              <Typography variant="body1">
                <strong>Password:</strong> {registrationData.password}
              </Typography>
            </div>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: '#64748b'
              }}
            >
              Please save these credentials securely. The member ID will be used for login.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: '1rem 2rem 2rem' }}>
            <Button 
              onClick={handleCloseDialog}
              variant="contained"
              sx={{
                textTransform: "capitalize",
                backgroundColor: '#2c8786',
                '&:hover': {
                  backgroundColor: '#581c87'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {(isLoading || isPending) && <LoadingComponent />}
    </Container>
  );
};

export default Register;