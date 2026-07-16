import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { Button, CircularProgress, Box, TextField } from '@mui/material';
import { useCreatePaymentOrder } from '../api/Memeber';
import { CreateOrderRequest } from '../types/payments';

interface PaymentComponentProps {
  amount: number;
  currency: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  customerName?: string;
  note?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  buttonText?: string;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  amount,
  currency = "INR",
  customerId,
  customerEmail,
  customerPhone,
  customerName,
  note,
  onSuccess,
  onError,
  buttonText = "Pay Now"
}) => {
  const { mutate: createOrder, isPending } = useCreatePaymentOrder();
  const [customAmount, setCustomAmount] = useState<number>(amount);

  const handlePayment = () => {
    if (customAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const paymentData: CreateOrderRequest = {
      amount: customAmount,
      currency,
      customer: {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_name: customerName
      },
      notes: note ? {
        note
      } as { [key: string]: any } : undefined
    };

    createOrder(paymentData, {
      onSuccess: (data:any) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error:any) => {
        if (onError) onError(error);
      }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(Number(e.target.value))}
          InputProps={{
            inputProps: { min: 1 }
          }}
          variant="outlined"
        />
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        onClick={handlePayment}
        disabled={isPending}
        sx={{
          background: 'linear-gradient(135deg, #2c8786 0%, #a855f7 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #581c87 0%, #9333ea 100%)',
            boxShadow: '0 4px 12px rgba(107, 33, 168, 0.3)',
          },
          py: 1.5,
          fontWeight: 600,
          textTransform: 'capitalize',
          borderRadius: 2
        }}
      >
        {isPending ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
            Processing...
          </Box>
        ) : (
          buttonText
        )}
      </Button>
    </Box>
  );
};

export default PaymentComponent;