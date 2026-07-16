import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputAdornment,
  } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from "@mui/icons-material/Payment";

  interface BankDetailsProps {
    formData: any;
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
  
  }

  export  const  BankDetails: React.FC<BankDetailsProps> = ({
    formData,
    handleInputChange,
  }) => {
    return(
        <Accordion
        defaultExpanded
        sx={{ boxShadow: "none", marginBottom: "20px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          sx={{
            backgroundColor: "#2c8786",
            color: "#fff",
          }}
        >
          Bank Details
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "2rem" }}>
          <div className="basic-details-accordion">
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                width: "100%",
              }}
            >
              <TextField
                label="Account No"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Account Number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Branch Name"
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Branch Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="IFSC Code"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="IFSC Code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Bank Name"
                name="bank_details"
                value={formData.bank_details }
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Bank Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Bank Address"
                name="bankAddress"
                multiline
                minRows={2}
                value={formData.bankAddress}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Bank Address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Pancard Number"
                name="Pan_no"
                value={formData.Pan_no}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Pancard Number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                width: "100%",
              }}
            >
              <TextField
                label="Google Pay"
                name="google_pay"
                value={formData. google_pay}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Google Pay"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Paytm"
                name="paytm"
                value={formData.paytm}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Paytm"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Phone Pay"
                name="phonepe"
                value={formData.phonepe}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Phone Pay"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </div>
        </AccordionDetails>
      </Accordion>
    )
  }