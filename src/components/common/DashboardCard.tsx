import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

interface DashboardCardProps {
  amount: string | number;
  title: string;
  subTitle?: string; 
  IconComponent?: React.ElementType;
  type?: 'default' | 'loan';
  dueAmount?: string | number;
  onRepay?: () => void;
  onClick?: () => void;
  isRepayEnabled?: boolean;
  alreadyRepaidToday?: boolean;
  background?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  amount, 
  title, 
  subTitle, 
  IconComponent,
  type = 'default',
  dueAmount = 0,
  onRepay,
  onClick,
  isRepayEnabled = false,
  alreadyRepaidToday = false,
  background
}) => {
  
  const getRepayButtonText = () => {
    if (isRepayEnabled) return 'Repay Now';
    if (alreadyRepaidToday) return 'Already Repaid Today';
    return 'Available Saturday';
  };

  const isBlurGray = background === 'blur_gray';
  const cardBg = isBlurGray 
    ? 'linear-gradient(135deg, rgba(240, 246, 255, 0.70) 0%, rgba(167, 185, 206, 0.70) 100%)'
    : (background || 'linear-gradient(to right, #41a4baff, #5bcbc9ff)');
  const cardColor = isBlurGray ? '#1e293b' : '#fff';
  const cardBorder = isBlurGray ? '1px solid rgba(255, 255, 255, 0.6)' : 'none';
  const cardBackdrop = isBlurGray ? 'blur(16px)' : 'none';
  const iconColor = isBlurGray ? '#2c8786' : 'inherit';

  if (type === 'loan') {
    return (
      <Card
        sx={{
          background: cardBg,
          color: cardColor,
          backdropFilter: cardBackdrop,
          WebkitBackdropFilter: cardBackdrop,
          border: cardBorder,
          borderRadius: '10px',
          padding: { xs: '6px', sm: '8px' },
          display: 'flex',
          alignItems: 'center',
          boxShadow: isBlurGray ? '0 8px 32px 0 rgba(31, 38, 135, 0.12)' : 3,
          height: '100%',
          minHeight: { xs: '120px', sm: '160px' },
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <CardContent sx={{ 
          textAlign: 'center', 
          p: { xs: '8px', sm: '12px' },
          width: '100%',
          '&:last-child': { paddingBottom: { xs: '8px', sm: '12px' } }
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              mb: 1.5,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            mb: 2 
          }}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  textShadow: isBlurGray ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                ₹{amount}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '1rem' },
                  mb: 0.5,
                  opacity: 0.9
                }}
              >
                Due Amount
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  textShadow: isBlurGray ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                ₹{dueAmount}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            onClick={onRepay}
            disabled={!isRepayEnabled}
            sx={{
              backgroundColor: isBlurGray
                ? (isRepayEnabled ? '#2c8786' : 'rgba(44, 135, 134, 0.15)')
                : (isRepayEnabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
              color: isBlurGray
                ? (isRepayEnabled ? '#fff' : '#475569')
                : 'white',
              backdropFilter: 'blur(10px)',
              border: isBlurGray ? '1px solid rgba(44, 135, 134, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: isBlurGray
                  ? (isRepayEnabled ? '#236d6c' : 'rgba(44, 135, 134, 0.2)')
                  : (isRepayEnabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'),
              },
              '&:disabled': {
                color: isBlurGray ? 'rgba(71, 85, 105, 0.6)' : 'rgba(255, 255, 255, 0.5)',
                border: isBlurGray ? '1px solid rgba(44, 135, 134, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)',
              },
              fontWeight: 'bold',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 0.8,
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              minWidth: '120px'
            }}
          >
          {getRepayButtonText()}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={onRepay || onClick}
      sx={{
        background: cardBg,
        color: cardColor,
        backdropFilter: cardBackdrop,
        WebkitBackdropFilter: cardBackdrop,
        border: cardBorder,
        borderRadius: '10px',
        padding: { xs: '12px', sm: '16px' },
        display: 'flex',
        alignItems: 'center',
        boxShadow: isBlurGray ? '0 8px 32px 0 rgba(31, 38, 135, 0.12)' : 3,
        height: '100%',
        minHeight: { xs: '120px', sm: '160px' },
        width: '100%',
        flexDirection: { xs: 'row', sm: 'row' },
        cursor: (onRepay || onClick) ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': (onRepay || onClick) ? {
          transform: 'translateY(-4px)',
          boxShadow: isBlurGray ? '0 12px 36px 0 rgba(31, 38, 135, 0.18)' : 6,
        } : {},
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '120px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: { xs: 1, sm: 0 },
          color: iconColor,
        }}
      >
        {IconComponent ? <IconComponent sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} /> : <CurrencyRupeeIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />}
      </Box>
      <CardContent 
        sx={{ 
          padding: { xs: '8px', sm: '16px' },
          width: '100%',
          '&:last-child': { paddingBottom: { xs: '8px', sm: '16px' } }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '5px',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          {amount}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center', 
            fontWeight: '500',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {title}
        </Typography>
        {subTitle && ( 
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              fontWeight: '400',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              marginTop: '4px'
            }}
          >
            {subTitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;