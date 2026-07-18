import React, { useContext, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  InputAdornment,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';

import WcIcon from '@mui/icons-material/Wc';
import LockIcon from '@mui/icons-material/Lock';
import MapIcon from "@mui/icons-material/Map";
import DomainIcon from "@mui/icons-material/Domain";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ExploreIcon from "@mui/icons-material/Explore";
import UserContext from '../../../context/user/userContext';
import { useSignupMutation } from '../../../api/Auth';
import { useGetStates, useGetDistricts, useGetCitiesAndTaluks } from "../../../api/Location";
import { LoadingComponent } from '../../../App';
import { toast } from 'react-toastify';

const NewResgister: React.FC = () => {
  const {user} = useContext(UserContext)
  const [formData, setFormData] = useState<Record<string, string>>({ paymentMode: 'offline', package_value: '' });
  
  const { data: states } = useGetStates();
  const { data: districts } = useGetDistricts(formData.state);
  const { data: citiesAndTaluks } = useGetCitiesAndTaluks(formData.state, formData.district);

  const stateOptions = states || [];
  const districtOptions = districts || [];
  const cityOptions = citiesAndTaluks?.cities || [];
  const talukOptions = citiesAndTaluks?.taluks || [];

  const [genderError, setGenderError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<{memberId: string; password: string}>({
    memberId: '',
    password: ''
  });
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: e.target.value,
    }));
  };

  const { mutate, isPending } = useSignupMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.gender) {
      setGenderError(true);
      return;
    }
    if (formData.password && formData.password.length <= 5) {
      setErrorMessage("Password must be at least 6 characters*");
      return;
    }
    try {
      setPaymentDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRegistration = () => {
    try {
      mutate({ 
        sponsor_id: user.Member_id, 
        Sponsor_code: user.Member_id,
        Sponsor_name: user.Name,
        ...formData 
      }, {
        onSuccess: async (response) => {
          if (response.success) {
            setRegistrationData({
              memberId: response.user.Member_id, 
              password: formData.password
            });

            if (formData.paymentMode === 'online') {
              try {
                const cashfree = await load({ mode: import.meta.env.PROD ? "production" : "sandbox" });
                const orderResponse = await axios.post(`${import.meta.env.VITE_MLM_API_URL}/api/payment/create-order`, {
                  amount: formData.package_value,
                  customer: {
                    customer_id: response.user.Member_id,
                    customer_name: formData.Name,
                    customer_email: formData.email,
                    customer_phone: formData.mobileno,
                  }
                });

                if (orderResponse.data.payment_session_id) {
                  let checkoutOptions = {
                    paymentSessionId: orderResponse.data.payment_session_id,
                    redirectTarget: "_modal",
                  };

                  cashfree.checkout(checkoutOptions).then((result: any) => {
                    if (result.error) {
                      toast.error("Payment failed or cancelled. Please try again.");
                    } else if (result.redirect) {
                      console.log("Payment will be redirected");
                    } else if (result.paymentDetails) {
                      toast.success("Payment successful! Your account is now active.");
                    }
                    setPaymentDialogOpen(false);
                    setSuccessDialogOpen(true);
                  });
                }
              } catch (error) {
                console.error("Payment initiation failed:", error);
                toast.error("Failed to initiate payment. Please contact support.");
              }
            } else {
              setPaymentDialogOpen(false);
              setSuccessDialogOpen(true);
              toast.success("Registration successful");
            }
          }
        },
        onError: (error: any) => {
          console.error("Mutation error:", error);
          const errorMessage = error.response?.data?.message || "Something went wrong! Please try again.";
          setErrorMessage(errorMessage);
          setPaymentDialogOpen(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
    // Optionally clear form after successful registration
    setFormData({});
  };

  return (
    <>
      <Card sx={{ margin: '2rem', mt: 10, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <CardContent>
          {/* First Accordion - Joining Details */}
          <Accordion 
            defaultExpanded
            sx={{
              boxShadow: 'none',
              '&.MuiAccordion-root': {
                backgroundColor: '#fff'
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#2c8786',
                color: '#fff',
                '& .MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              Joining Details
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '2rem' }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField
                  label="Sponsor Code"
                  name="sponsorCode"
                  value={user?.Member_id}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#2c8786',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c8786',
                      }
                    }
                  }}
                />
                <TextField
                  label="Sponsor Name"
                  name="sponsorName"
                  value={user?.Name}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#2c8786',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c8786',
                      }
                    }
                  }}
                />
              </form>
            </AccordionDetails>
          </Accordion>

          {/* Second Accordion - New Member Details */}
          <Accordion 
            defaultExpanded
            sx={{
              mt: 2,
              boxShadow: 'none',
              '&.MuiAccordion-root': {
                backgroundColor: '#fff'
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#2c8786',
                color: '#fff',
                '& .MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              New Member Details
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '2rem' }}>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField
                  label="Name"
                  name="Name"
                  value={formData.Name || ''}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#2c8786',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c8786',
                      }
                    }
                  }}
                />
                
                <Autocomplete
                  options={stateOptions}
                  value={formData.state || null}
                  onChange={(_, newValue) => {
                    handleInputChange({ target: { name: 'state', value: newValue || '' } } as any);
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
                    handleInputChange({ target: { name: 'district', value: newValue || '' } } as any);
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
                    handleInputChange({ target: { name: 'city', value: newValue || '' } } as any);
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
                    handleInputChange({ target: { name: 'taluk', value: newValue || '' } } as any);
                  }}
                  onInputChange={(_, newInputValue) => {
                    handleInputChange({ target: { name: 'taluk', value: newInputValue } } as any);
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

                <FormControl error={!!genderError}>
                  <FormLabel sx={{ color: '#2c8786', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <WcIcon sx={{ color: '#2c8786' }} />
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel 
                      value="Male" 
                      control={<Radio sx={{
                        '&.Mui-checked': {
                          color: '#2c8786',
                        }
                      }}/>} 
                      label="Male" 
                    />
                    <FormControlLabel 
                      value="Female" 
                      control={<Radio sx={{
                        '&.Mui-checked': {
                          color: '#2c8786',
                        }
                      }}/>} 
                      label="Female" 
                    />
                  </RadioGroup>
                </FormControl>
                {genderError && (
                  <FormHelperText sx={{color:"#d32f2f",marginTop:"-20px"}}>Please select your gender*</FormHelperText>
                )}
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#2c8786',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c8786',
                      }
                    }
                  }}
                />
                <TextField
                  label="Mobile"
                  name="mobileno"
                  type="tel"
                  value={formData.mobileno || ''}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your mobile number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#2c8786',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c8786',
                      }
                    }
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your password"
                  error={!!errorMessage} 
                  helperText={errorMessage} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#2c8786',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c8786',
                      }
                    }
                  }}
                />
                
                <TextField
                  select
                  label="Select Package"
                  name="package_value"
                  value={formData.package_value || ''}
                  onChange={(e) => {
                    handleInputChange({ target: { name: 'package_value', value: e.target.value } } as any);
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CardGiftcardIcon sx={{ color: '#2c8786' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="" disabled><em>Select Package</em></MenuItem>
                  <MenuItem value="5000">5000 INR Package</MenuItem>
                  <MenuItem value="1">1 INR Test </MenuItem>
                </TextField>

              </form>
            </AccordionDetails>
          </Accordion>

          {/* Register Button */}
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isPending}
            sx={{
              textTransform: "capitalize",
              backgroundColor: '#2c8786',
              margin: '1rem',
              float: 'right',
              '&:hover': {
                backgroundColor: '#581c87'
              },
              '&:disabled': {
                backgroundColor: '#cccccc'
              }
            }}
          >
            {isPending ? 'Registering...' : 'Register'}
          </Button>
        </CardContent>
        {isPending && <LoadingComponent/>}
      </Card>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        aria-labelledby="payment-dialog"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle 
          id="payment-dialog"
          sx={{ 
            backgroundColor: '#2c8786', 
            color: 'white',
            textAlign: 'center'
          }}
        >
          Select Payment Method
        </DialogTitle>
        <DialogContent sx={{ padding: '2rem' }}>
          <Box sx={{ mb: 1, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              ORDER SUMMARY
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                {formData.package_value ? `${formData.package_value} INR Package` : 'No Package Selected'}
              </Typography>
              <Typography variant="h6" color="#2c8786" fontWeight="bold">
                ₹{formData.package_value || '0'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
            Please select your preferred payment method.
          </Typography>
          <FormControl fullWidth>
            <RadioGroup
              name="paymentMode"
              value={formData.paymentMode || 'offline'}
              onChange={handleInputChange}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Box sx={{ 
                border: '1px solid', 
                borderColor: formData.paymentMode === 'offline' ? '#2c8786' : '#e2e8f0',
                borderRadius: 1, 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: formData.paymentMode === 'offline' ? '#f0fdfa' : 'transparent',
              }} onClick={() => handleInputChange({ target: { name: 'paymentMode', value: 'offline' } } as any)}>
                <FormControlLabel
                  value="offline"
                  control={<Radio sx={{ "&.Mui-checked": { color: "#2c8786" } }} />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Offline Payment</Typography>
                      <Typography variant="body2" color="text.secondary">Admin will activate your account later</Typography>
                    </Box>
                  }
                  sx={{ flexGrow: 1, m: 0 }}
                />
              </Box>
              <Box sx={{ 
                border: '1px solid', 
                borderColor: formData.paymentMode === 'online' ? '#2c8786' : '#e2e8f0',
                borderRadius: 1, 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: formData.paymentMode === 'online' ? '#f0fdfa' : 'transparent',
              }} onClick={() => handleInputChange({ target: { name: 'paymentMode', value: 'online' } } as any)}>
                <FormControlLabel
                  value="online"
                  control={<Radio sx={{ "&.Mui-checked": { color: "#2c8786" } }} />}
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Online Payment</Typography>
                      <Typography variant="body2" color="text.secondary">Pay now to activate immediately</Typography>
                    </Box>
                  }
                  sx={{ flexGrow: 1, m: 0 }}
                />
              </Box>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 2rem 2rem', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setPaymentDialogOpen(false)}
            variant="outlined"
            sx={{
              color: '#2c8786',
              borderColor: '#2c8786',
              '&:hover': {
                borderColor: '#1f6362',
                backgroundColor: '#f0fdfa'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmRegistration}
            variant="contained"
            disabled={isPending}
            sx={{
              backgroundColor: '#2c8786',
              '&:hover': {
                backgroundColor: '#1f6362'
              }
            }}
          >
            {isPending ? "Processing..." : "Confirm & Register"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default NewResgister;