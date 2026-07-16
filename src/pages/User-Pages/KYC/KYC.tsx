import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BadgeIcon from '@mui/icons-material/Badge';
import UserContext from '../../../context/user/userContext';
// import { useUpdateMember } from '../../../api/Memeber';
import { LoadingComponent } from '../../../App';
import { useSubmitKYC } from '../../../api/Memeber';

const KYC: React.FC = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    accountName: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    Pan_no: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        accountName: user?.Name ,
        account_number: user?.account_number ,
        ifsc_code: user?.ifsc_code ,
        bank_name: user?.bank_name ,
        Pan_no: user?.Pan_no ,
        address: user?.address ,
      });
    }
  }, [user]);

  const submitKYC = useSubmitKYC();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    submitKYC.mutate({
      ref_no: user.Member_id,
      bankAccount: formData.account_number,
      ifsc: formData.ifsc_code,
      pan: formData.Pan_no,
      address: formData.address,
      bankName: formData.bank_name,
    });
  };


  return (
    <Card sx={{ margin: '2rem', mt: 10, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <CardContent>
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
            aria-controls="basic-details-content"
            id="basic-details-header"
            sx={{
              backgroundColor: '#2c8786',
              color: '#fff',
              '& .MuiSvgIcon-root': {
                color: '#fff'
              }
            }}
          >
            Update Bank Account Details
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '2rem' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TextField
                label="Account Name"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter account holder name"
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
                label="Account Number"
                name="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter account number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceWalletIcon sx={{ color: '#2c8786' }} />
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
                label="IFSC Code"
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter IFSC code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ConfirmationNumberIcon sx={{ color: '#2c8786' }} />
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
                label="Bank Name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter bank name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon sx={{ color: '#2c8786' }} />
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
                label="PAN Number"
                name="Pan_no"
                value={formData.Pan_no}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter PAN number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: '#2c8786' }} />
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
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitKYC.isPending}
                sx={{
                  backgroundColor: '#2c8786',
                  alignSelf: 'flex-end',
                  '&:hover': {
                    backgroundColor: '#581c87'
                  }
                }}
              >
                Update
              </Button>
            </form>
          </AccordionDetails>
        </Accordion>
      </CardContent>
      {submitKYC.isPending && <LoadingComponent />}
    </Card>
  );
};

export default KYC;
