import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const Activate: React.FC = () => {
  const [formData, setFormData] = useState({
    memberCode: '',
    package: '',
    selectedPackage: '',
    packageNo: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedPackage: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    alert('Package Activated Successfully!');
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
            Activate Details
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '2rem' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TextField
                label="Member Code"
                name="memberCode"
                value={formData.memberCode}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter member code"
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
                label="Package"
                name="package"
                value={formData.package}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter package"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon sx={{ color: '#2c8786' }} />
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
              <FormControl fullWidth>
                <InputLabel id="package-select-label">Select Package</InputLabel>
                <Select
                  labelId="package-select-label"
                  id="package-select"
                  value={formData.selectedPackage}
                  label="Select Package"
                  onChange={handleSelectChange}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2c8786',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2c8786',
                    }
                  }}
                >
                  <MenuItem value="package1">Package 1</MenuItem>
                  <MenuItem value="package2">Package 2</MenuItem>
                  <MenuItem value="package3">Package 3</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Package No"
                name="packageNo"
                value={formData.packageNo}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Enter package number"
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
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#2c8786',
                  alignSelf: 'flex-end',
                  '&:hover': {
                    backgroundColor: '#581c87'
                  }
                }}
              >
                Submit
              </Button>
            </form>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Activate;
