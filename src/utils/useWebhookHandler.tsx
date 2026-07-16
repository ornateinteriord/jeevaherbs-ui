import {  useCallback } from 'react';
import { toast } from 'react-toastify';

// Define webhook event types
interface WebhookEvent {
  eventType: string;
  data: any;
  timestamp: string;
}

// Hook to handle incoming webhook events
export const useWebhookHandler = (onWebhookReceived?: (event: WebhookEvent) => void) => {
  // Handle payment success webhook
  const handlePaymentSuccess = useCallback((data: any) => {
    toast.success("Payment successful!");
    console.log("Payment successful:", data);
    // You could update user balance, unlock features, etc.
  }, []);

  // Handle payment failure webhook
  const handlePaymentFailure = useCallback((data: any) => {
    toast.error("Payment failed. Please try again.");
    console.log("Payment failed:", data);
  }, []);

  // Handle subscription events
  const handleSubscriptionEvent = useCallback((data: any) => {
    switch (data.eventType) {
      case "subscription.created":
        toast.info("Subscription created successfully");
        break;
      case "subscription.cancelled":
        toast.warn("Subscription cancelled");
        break;
      case "subscription.renewed":
        toast.success("Subscription renewed");
        break;
      default:
        toast.info(`Subscription event: ${data.eventType}`);
    }
    console.log("Subscription event:", data);
  }, []);

  // Generic webhook handler
  const handleWebhook = useCallback((event: WebhookEvent) => {
    console.log("Webhook received:", event);
    
    // Call the provided callback if exists
    if (onWebhookReceived) {
      onWebhookReceived(event);
    }

    // Handle specific event types
    switch (event.eventType) {
      case "PAYMENT.SUCCESS":
        handlePaymentSuccess(event.data);
        break;
      case "PAYMENT.FAILURE":
        handlePaymentFailure(event.data);
        break;
      case "SUBSCRIPTION.CREATED":
      case "SUBSCRIPTION.CANCELLED":
      case "SUBSCRIPTION.RENEWED":
        handleSubscriptionEvent(event.data);
        break;
      default:
        console.log("Unhandled webhook event:", event.eventType);
    }
  }, [onWebhookReceived, handlePaymentSuccess, handlePaymentFailure, handleSubscriptionEvent]);

  return {
    handleWebhook,
    handlePaymentSuccess,
    handlePaymentFailure,
    handleSubscriptionEvent
  };
};