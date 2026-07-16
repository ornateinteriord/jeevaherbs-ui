import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import DataTable from "react-data-table-component";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import {
  DASHBOARD_CUTSOM_STYLE,
  getMailBoxColumns,
} from "../../../utils/DataTableColumnsProvider";
import TokenService from "../../../api/token/tokenService";
import { useCreateTicket, useGetTicketDetails } from "../../../api/Memeber";
import { toast } from "react-toastify";
import useSearch from "../../../hooks/SearchQuery";
import { getFormattedDate } from "../../../utils/common";

interface Ticket {
  ticket_date: string;
  ticket_no: string;
  type_of_ticket: string;
  SUBJECT: string;
  ticket_status: "pending" | "solved";
  reply_details: string;
}
const MailBox = () => {
  const userId = TokenService.getUserId();
  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useGetTicketDetails(userId!);

  useEffect(() => {
    if (isError) {
      toast.error(error.message || "Failed to fetch Transaction details");
    }
  }, [isError, error]);

  const { searchQuery, setSearchQuery, filteredData} = useSearch(tickets)
     

  const [formData, setFormData] = useState({
    ticketType: "",
    subject: "",
    details: "",
  });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const createTicketMutation = useCreateTicket();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      ticketType: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const newTicket = {
        type_of_ticket: formData.ticketType,
        SUBJECT: formData.subject,
        ticket_details: formData.details,
      };

      createTicketMutation.mutate(newTicket);
    } catch (error) {
      console.error("Failed to create ticket", error);
    } finally {
      setFormData({
        ticketType: "",
        subject: "",
        details: "",
      });
    }
  };

  return (
    <>
      <Card
        sx={{
          margin: "2rem",
          mt: 10,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <CardContent sx={{ padding: "24px" }}>
          <Accordion
            defaultExpanded
            sx={{
              boxShadow: "none",
              "&.MuiAccordion-root": {
                backgroundColor: "#fff",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: "#2c8786",
                color: "#fff",
                "& .MuiSvgIcon-root": { color: "#fff" },
                minHeight: "64px",
              }}
            >
              Mail Box
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "2rem" }}>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Ticket Type</InputLabel>
                  <Select
                    value={formData.ticketType}
                    label="Ticket Type"
                    onChange={handleSelectChange}
                    name="ticketType"
                    required
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        "&:hover": {
                          borderColor: "#2c8786",
                        },
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#2c8786",
                      },
                    }}
                  >
                    <MenuItem value="Modify">Modify</MenuItem>
                    <MenuItem value="Payments related">
                      Payments Related
                    </MenuItem>
                    <MenuItem value="Business Queries">
                      Business Queries
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="medium"
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
                  label="Details"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  size="medium"
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

                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{
                    backgroundColor: "#2c8786",
                    alignSelf: "flex-end",
                    "&:hover": {
                      backgroundColor: "#581c87",
                    },
                  }}
                >
                  Submit
                </Button>
              </form>
            </AccordionDetails>
          </Accordion>

          {/* Table Section */}
          <Accordion defaultExpanded sx={{ mt: 4 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: "#2c8786",
                color: "#fff",
                "& .MuiSvgIcon-root": { color: "#fff" },
                minHeight: "64px",
              }}
            >
              List of Support Details
            </AccordionSummary>
            <AccordionDetails>
              <DataTable
                columns={getMailBoxColumns(handleOpenDialog)}
                data={filteredData }
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                progressPending={isLoading || createTicketMutation.isPending}
                progressComponent={
                  <CircularProgress size={"4rem"} sx={{ color: "#2c8786" }} />
                }
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
                responsive
                subHeader
                subHeaderComponent={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                      padding: "0.5rem",
                    }}
                  >
                    <TextField
                      placeholder="Search"
                      variant="outlined"
                      size="small"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                }
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={false}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#2c8786",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
          Ticket Details
          <IconButton
            onClick={handleCloseDialog}
            size="medium"
            sx={{ color: "#fff" }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, padding: "24px" }}>
          {selectedTicket && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" sx={{ color: "#2c8786" }}>
                  Ticket Information
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2">Ticket No:</Typography>
                  <Typography>{selectedTicket.ticket_no}</Typography>

                  <Typography variant="subtitle2">Date:</Typography>
                  <Typography>{(getFormattedDate(selectedTicket.ticket_date))}</Typography>

                  <Typography variant="subtitle2">Type:</Typography>
                  <Typography>{selectedTicket.type_of_ticket}</Typography>

                  <Typography variant="subtitle2">Subject:</Typography>
                  <Typography>{selectedTicket.SUBJECT}</Typography>

                  <Typography variant="subtitle2">Status:</Typography>
                  <Typography
                    sx={{
                      color:
                        selectedTicket?.ticket_status?.trim().toLowerCase() ===
                        "pending"
                          ? "#fb741a"
                          : "#569f35",
                    
                      padding: "4px 8px",
                      borderRadius: "4px",
                      width: "fit-content",
                      fontSize: "14px",
                    }}
                  >
                    {selectedTicket.ticket_status?.charAt(0).toUpperCase() + selectedTicket.ticket_status?.slice(1)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ color: "#2c8786" }}>
                  Reply Details
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    padding: "1rem",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <Typography color="text.secondary" variant="body1">
                    {selectedTicket.reply_details}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MailBox;
