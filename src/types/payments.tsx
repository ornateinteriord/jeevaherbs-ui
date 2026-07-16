// types/payment.ts
export interface CreateOrderRequest {
  amount: number;
  currency: string;
  customer: {
    customer_id: string;
    customer_email?: string;
    customer_phone?: string;
    customer_name?: string;
  };
  notes?: {
    isLoanRepayment?: boolean;
    [key: string]: any;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  payment_session_id: string;
  order_amount: number;
  order_currency: string;
  is_loan_repayment: boolean;
  member_id: string;
  member_name: string;
  loan_details?: {
    current_due_amount: number;
    repayment_amount: number;
    new_due_amount: number;
    original_loan_id: string;
  };
}

// Payment status types for URL query parameters
export type PaymentStatus = "PAID" | "FAILED" | "USER_DROPPED" | "PENDING" | "CANCELLED";

export interface PaymentRedirectParams {
  payment_status: PaymentStatus;
  order_id: string;
  member_id: string;
}

// Verify payment response
export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment_status: PaymentStatus;
  order_id: string;
  amount?: number;
  payment_time?: string;
}