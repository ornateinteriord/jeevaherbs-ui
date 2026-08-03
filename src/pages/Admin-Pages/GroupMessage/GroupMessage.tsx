import  { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CampaignIcon from '@mui/icons-material/Campaign';
import api from '../../../api/Api';
import { toast } from 'react-toastify';

export default function GroupMessage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/announcement', { message });
      toast.success('Dashboard announcement sent successfully');
      setMessage('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{mt : {xs : 9, md : 7}, p: { xs: 2, sm: 4 }, minHeight: 'calc(100vh - 80px)', bgcolor: '#f4f7f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          maxWidth: 900, 
          w: '100%',
          overflow: 'hidden', 
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }}
      >
        <Grid container>
          {/* Left Side: Colorful Banner */}
          <Grid 
            item 
            xs={12} 
            md={5} 
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <CampaignIcon sx={{ fontSize: 42, color: 'white', mr:{xs:0,md:2} }} />
              <Typography variant="h4" fontWeight="800" sx={{ fontSize: { xs:
                 '1.75rem', md: '2.125rem' } }}>
                Global Broadcast
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              Reach your community instantly. Messages appear live on all member dashboards.
            </Typography>
          </Grid>

          {/* Right Side: Input Form */}
          <Grid 
            item 
            xs={12} 
            md={7} 
            sx={{ 
              p: { xs: 4, md: 6 },
              bgcolor: 'white'
            }}
          >
            <Typography variant="h5" fontWeight="700" color="#333" mb={1}>
              Compose Message
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Type the announcement you want to broadcast below.
            </Typography>



            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              placeholder="E.g., Welcome to the biggest sale of the year! Upgrade your package today and earn 2x rewards."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#10b981',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSend}
              disabled={loading || !message.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{ 
                bgcolor: '#10b981', 
                '&:hover': { bgcolor: '#059669', transform: 'translateY(-2px)' }, 
                py: 1.8, 
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Now'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
