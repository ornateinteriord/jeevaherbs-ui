import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGetLoadRequests, useProcessLoadRequest } from '../../../api/Admin';

const LoadRequests = () => {
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);

  const { data: loadRequests = [], isLoading, error } = useGetLoadRequests(filterStatus);
  const processLoadRequest = useProcessLoadRequest();

  const handleProcess = (transactionId: string, action: 'approve' | 'reject') => {
    if (window.confirm(`Are you sure you want to ${action} this request?`)) {
      processLoadRequest.mutate({ transactionId, action });
    }
  };

  const handleOpenScreenshot = (screenshot: string) => {
    setCurrentScreenshot(screenshot);
    setScreenshotModalOpen(true);
  };

  const handleCloseScreenshot = () => {
    setScreenshotModalOpen(false);
    setCurrentScreenshot(null);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading requests</Typography>;

  return (
    <Box sx={{ p: 3,mt:10 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2c8786' }}>
        Load Requests (Manual QR Top-Up)
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Member ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Screenshot</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3, color: '#64748b' }}>
                      No {filterStatus.toLowerCase()} requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  loadRequests.map((req: any) => (
                    <TableRow key={req._id}>
                      <TableCell>{req.transaction_id}</TableCell>
                      <TableCell>{req.member_id}</TableCell>
                      <TableCell>{req.Name || '-'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{req.ew_credit}</TableCell>
                      <TableCell>{new Date(req.transaction_date).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={req.status} 
                          color={
                            req.status === 'Completed' ? 'success' : 
                            req.status === 'Pending' ? 'warning' : 'error'
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {req.screenshot ? (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            color="info"
                            onClick={() => handleOpenScreenshot(req.screenshot)}
                          >
                            View
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">N/A</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {req.status === 'Pending' ? (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small"
                              onClick={() => handleProcess(req._id, 'approve')}
                              disabled={processLoadRequest.isPending}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="contained" 
                              color="error" 
                              size="small"
                              onClick={() => handleProcess(req._id, 'reject')}
                              disabled={processLoadRequest.isPending}
                            >
                              Reject
                            </Button>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Screenshot Modal */}
      <Dialog 
        open={screenshotModalOpen} 
        onClose={handleCloseScreenshot}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Payment Screenshot
          <IconButton onClick={handleCloseScreenshot}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
          {currentScreenshot ? (
            <img 
              src={currentScreenshot} 
              alt="Payment Screenshot" 
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
            />
          ) : (
            <Typography>No screenshot available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScreenshot} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoadRequests;
