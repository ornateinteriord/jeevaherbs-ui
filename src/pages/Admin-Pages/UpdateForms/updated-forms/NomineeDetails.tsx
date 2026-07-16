import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputAdornment,
  } from "@mui/material";
  import PersonIcon from "@mui/icons-material/Person";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

  interface NomineeDetailsProps {
    formData: any;
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;

  }

  export  const  NomineeDetails: React.FC< NomineeDetailsProps> = ({
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
          Nominee Details
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
                label="Nominee Name"
                name="Nominee_name"
                value={formData. Nominee_name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Nominee Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#2c8786" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Nominee Relation"
                name="Nominee_Relation"
                value={formData.Nominee_Relation}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Nominee Relation"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#2c8786" }} />
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
                label="Nominee Age"
                name="Nominee_age"
                value={formData.Nominee_age}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="Nominee Age"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#2c8786" }} />
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