import { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import { Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataTable from 'react-data-table-component';
import { DASHBOARD_CUTSOM_STYLE, getSupportTicketColumns } from '../../../utils/DataTableColumnsProvider';
import { useGetAllTickets, useUpdateTickets } from '../../../api/Admin';
import { toast } from 'react-toastify';
import useSearch from '../../../hooks/SearchQuery';

interface Ticket{
  _id:string;
  ticket_date:string;
  ticket_no:string;
  reference_id:string;
  type_of_ticket:string;
  SUBJECT:string;
  ticket_status:"pending" | "solved";

}


const SupportTickets = () => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const {data:tickets,isLoading,isError,error} = useGetAllTickets()

  const handleReplyClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsReplyDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsReplyDialogOpen(false);
    setReplyText('');
  };
  
  const replyTicketMutation = useUpdateTickets()
  const handleSubmitReply = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!selectedTicket) return;
      const replyTicket = {
        id:selectedTicket._id,
        reply_details:replyText,
        
      }
     replyTicketMutation.mutate(replyTicket)
    } catch (error) {
      console.error("Failed to update ticket", error);
    } finally {
      handleCloseDialog();
    }
    
  };

   useEffect(() => {
    if (isError) {
        toast.error(
          error.message
        );
      }
    }, [isError, error]);
    
  const { searchQuery, setSearchQuery, filteredData } = useSearch(tickets)
  
    

  return (
    <>
      <Typography variant="h4" sx={{ margin: '2rem', mt: 10 }}>
        Support Tickets
      </Typography>
      <Card sx={{ margin: '2rem', mt: 2 }}>
        <CardContent>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#2c8786',
                color: '#fff',
                '& .MuiSvgIcon-root': { color: '#fff' }
              }}
            >
              List of Support Tickets
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  sx={{ minWidth: 200 }}
                  value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DataTable
                columns={getSupportTicketColumns(handleReplyClick)}
                data={filteredData}
                pagination
                customStyles={DASHBOARD_CUTSOM_STYLE}
                paginationPerPage={25}
                progressPending={isLoading}
                progressComponent={
                  <CircularProgress size={"4rem"} sx={{ color: "#2c8786" }}  />
                }
                paginationRowsPerPageOptions={[25, 50, 100]}
                highlightOnHover
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={isReplyDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#2c8786', color: '#fff' }}>
          Reply to Ticket #{selectedTicket?.ticket_no}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Ticket Date:</strong> {selectedTicket?.ticket_date}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Type of Ticket:</strong> {selectedTicket?.type_of_ticket}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Subject:</strong> {selectedTicket?.SUBJECT}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Status:</strong> {selectedTicket?.ticket_status}
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Type your reply here..."
            sx={{
              mt: 1,
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
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="error">
            Cancel
          </Button>
         
         <Button
         onClick={handleSubmitReply}
         variant="contained"
         sx={{
           backgroundColor: '#2c8786',
           '&:hover': { backgroundColor: '#581c87' }
         }}
         disabled={!selectedTicket}
       >
         Reply
       </Button>
      
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupportTickets;