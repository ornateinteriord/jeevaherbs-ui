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
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import MapIcon from "@mui/icons-material/Map";
import DomainIcon from "@mui/icons-material/Domain";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ExploreIcon from "@mui/icons-material/Explore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useGetStates, useGetDistricts, useGetCitiesAndTaluks } from "../../../../api/Location";
import { MuiDatePicker } from "../../../../components/common/DateFilterComponent";

interface BasicDetailsProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleRadioChange:(e: React.ChangeEvent<HTMLInputElement>)=>void;
}

export  const  BasicDetails: React.FC<BasicDetailsProps> = ({
  formData,
  handleInputChange,
  handleRadioChange,
}) => {
  const { data: states } = useGetStates();
  const { data: districts } = useGetDistricts(formData.state);
  const { data: citiesAndTaluks } = useGetCitiesAndTaluks(formData.state, formData.district);

  const stateOptions = states || [];
  const districtOptions = districts || [];
  const cityOptions = citiesAndTaluks?.cities || [];
  const talukOptions = citiesAndTaluks?.taluks || [];

 const handleDateChange = (formattedDate: string) => {
  handleInputChange({
    target: {
      name: "dob",
      value: formattedDate,
    },
  } as React.ChangeEvent<HTMLInputElement>);
};

  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", marginBottom: "20px" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={{
          backgroundColor: "#2c8786",
          color: "#fff",
        }}
      >
        Basic Details
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
              label="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="FatherName"
              name="Father_name"
              value={formData.Father_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your father name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              multiline
              minRows={2}
              variant="outlined"
              placeholder="Enter your address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Autocomplete
              options={stateOptions}
              value={formData.state || null}
              onChange={(_, newValue) => {
                handleInputChange({ target: { name: 'state', value: newValue || "" } } as any);
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
                        <MapIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Autocomplete
              options={districtOptions}
              value={formData.district || null}
              onChange={(_, newValue) => {
                handleInputChange({ target: { name: 'district', value: newValue || "" } } as any);
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
                        <DomainIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Autocomplete
              options={cityOptions}
              value={formData.city || null}
              onChange={(_, newValue) => {
                handleInputChange({ target: { name: 'city', value: newValue || "" } } as any);
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
                        <LocationCityIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Autocomplete
              freeSolo
              options={talukOptions}
              value={formData.taluk || ""}
              onChange={(_, newValue) => {
                handleInputChange({ target: { name: 'taluk', value: newValue || "" } } as any);
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
                        <ExploreIcon sx={{ color: "#2c8786" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your pincode"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: "#2c8786" }} />
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
            <FormControl>
              <FormLabel sx={{ color: "#2c8786" }}>
                <WcIcon sx={{ color: "#2c8786" }} />
                Gender
              </FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="Male"
                  control={
                    <Radio sx={{ "&.Mui-checked": { color: "#2c8786" } }} />
                  }
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={
                    <Radio sx={{ "&.Mui-checked": { color: "#2c8786" } }} />
                  }
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <div>
              <MuiDatePicker
                date={formData.dob}
                setDate={handleDateChange}
                label="Date of Birth"
              />
            </div>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mobile No"
              name="mobileno"
              type="tel"
              value={formData.mobileno}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your mobile number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your mobile number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Transaction Password"
              name="transaction_pass"
              type="password"
              value={formData.transaction_pass}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Enter your mobile number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#2c8786" }} />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
