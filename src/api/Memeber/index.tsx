// api/Member.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import UserContext from "../../context/user/userContext";
import { toast } from "react-toastify";
import { get, post, put } from "../Api";
import axios from "axios";
import TokenService from "../token/tokenService";
import { CreateOrderRequest, CreateOrderResponse, VerifyPaymentResponse, PaymentStatus } from "../../types/payments";

// Declare window for potential future payment SDKs
declare global {
  interface Window {
    // Payment SDK placeholder - add payment gateway types here as needed
  }
}

// Verify payment status after redirect from payment gateway
// This is what the frontend should call after user returns from payment
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string): Promise<VerifyPaymentResponse> => {
      console.log("🔄 Verifying payment status for order:", orderId);

      const response = await get(`/payments/verify-payment/${orderId}`);

      if (!response) throw new Error("No response from server");

      const data = response.data || response;

      console.log("📥 Payment verification result:", data);

      return data;
    },

    onSuccess: (data: VerifyPaymentResponse) => {
      console.log("✅ Payment verification completed:", data);

      // Refresh relevant queries
      queryClient.invalidateQueries({ queryKey: ["transactionsWithConfig"] });
      queryClient.invalidateQueries({ queryKey: ["walletOverview"] });
      queryClient.invalidateQueries({ queryKey: ["memberDetails"] });

      // Show appropriate message based on payment status
      if (data.payment_status === "PAID") {
        toast.success("Payment successful! Your loan repayment has been processed.");
      } else if (data.payment_status === "FAILED") {
        toast.error("Payment failed. Please try again.");
      } else if (data.payment_status === "USER_DROPPED") {
        toast.warning("Payment was cancelled. No charges were made.");
      } else if (data.payment_status === "PENDING") {
        toast.info("Payment is being processed. Please wait...");
      } else {
        toast.info(`Payment status: ${data.payment_status}`);
      }
    },

    onError: (error: any) => {
      console.error("❌ Failed to verify payment:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to verify payment status";
      toast.error(message);
    },
  });
};

// Check payment status (polling)
export const useCheckPaymentStatus = (orderId: string | null, enabled: boolean = false) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["paymentStatus", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("No order ID provided");

      const response = await get(`/payments/status/${orderId}`);
      const data = response?.data || response;

      // If payment is completed, invalidate queries
      if (data?.status === "PAID" || data?.status === "FAILED") {
        queryClient.invalidateQueries({ queryKey: ["transactionsWithConfig"] });
        queryClient.invalidateQueries({ queryKey: ["walletOverview"] });
        queryClient.invalidateQueries({ queryKey: ["memberDetails"] });
      }

      return data;
    },
    enabled: enabled && !!orderId,
    refetchInterval: (query) => {
      // Stop polling if payment is complete or failed
      const status = query.state.data?.status;
      if (status === "PAID" || status === "FAILED" || status === "CANCELLED") {
        return false;
      }
      return 5000; // Poll every 5 seconds while pending
    },
    staleTime: 0,
  });
};

// Process successful loan repayment
export const useProcessLoanRepayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, transactionId }: { memberId: string; transactionId: string }) => {
      console.log("🔄 Processing loan repayment...", { memberId, transactionId });

      const response = await post(`/payments/process-successful-payment`, {
        memberId,
        transactionId
      });

      if (!response) throw new Error("No response from server");

      const data = response.data || response;

      if (data.success === false) {
        throw new Error(data.message || "Failed to process loan repayment");
      }

      return data;
    },

    onSuccess: (data: any) => {
      console.log("✅ Loan repayment processed:", data);
      toast.success("Loan repayment processed successfully!");

      queryClient.invalidateQueries({ queryKey: ["transactionsWithConfig"] });
      queryClient.invalidateQueries({ queryKey: ["walletOverview"] });
      queryClient.invalidateQueries({ queryKey: ["memberDetails"] });
    },

    onError: (error: any) => {
      console.error("❌ Failed to process loan repayment:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to process loan repayment";
      toast.error(message);
    },
  });
};

// Revert failed loan repayment
export const useRevertLoanRepayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, transactionId }: { memberId: string; transactionId: string }) => {
      console.log("🔄 Reverting loan repayment...", { memberId, transactionId });

      const response = await post(`/payments/process-failed-payment`, {
        memberId,
        transactionId
      });

      if (!response) throw new Error("No response from server");

      const data = response.data || response;

      if (data.success === false) {
        throw new Error(data.message || "Failed to revert loan repayment");
      }

      return data;
    },

    onSuccess: (data: any) => {
      console.log("✅ Loan repayment reverted:", data);
      toast.info("Payment failed. Loan status reverted.");

      queryClient.invalidateQueries({ queryKey: ["transactionsWithConfig"] });
      queryClient.invalidateQueries({ queryKey: ["walletOverview"] });
      queryClient.invalidateQueries({ queryKey: ["memberDetails"] });
    },

    onError: (error: any) => {
      console.error("❌ Failed to revert loan repayment:", error);
      console.error("CRITICAL: Failed to revert loan repayment - manual intervention may be required");

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to revert loan repayment - contact support";
      toast.error(message);
    },
  });
};



// Create payment order and return redirect/payment link
export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: async (paymentData: CreateOrderRequest): Promise<CreateOrderResponse> => {
      console.log("🔄 Creating payment order...", paymentData);

      const response = await post(`/payments/create-order`, paymentData);

      if (!response) throw new Error("No response from server");

      const data = response.data || response;

      console.log("📥 Backend response:", data);

      if (data.success === false) {
        throw new Error(data.message || "Payment order creation failed");
      }

      if (!data.payment_session_id) {
        console.error("❌ Missing payment_session_id:", data);
        throw new Error("Invalid payment order response - missing payment_session_id");
      }

      return data;
    },

    onSuccess: (data: CreateOrderResponse) => {
      console.log("✅ Payment order created successfully:", data);
      toast.success("Payment order created successfully!");
      // Payment processing will be handled by the backend
    },

    onError: (error: any) => {
      console.error("❌ Failed to create payment order:", error);
      console.error("❌ Error details:", error.response?.data);

      let message = "Unable to initialize payment";

      if (error.response?.data?.code === "payment_session_id_invalid") {
        message = "Payment session is invalid or expired. Please try again.";
      } else if (error.response?.data?.code === "order_meta.return_url_invalid") {
        message = "Return URL configuration error. Please contact support.";
      } else {
        message = error?.response?.data?.message || error?.message || message;
      }

      toast.error(message);
    },
  });
};

// Enhanced loan repayment hook
export const useRepayLoan = () => {
  const createPaymentOrder = useCreatePaymentOrder();

  return useMutation({
    mutationFn: async ({ memberId, amount, memberDetails }: {
      memberId: string;
      amount: number;
      memberDetails?: any;
    }) => {
      console.log("💰 Creating loan repayment order...", { memberId, amount });

      const paymentData: CreateOrderRequest = {
        amount,
        currency: "INR",
        customer: {
          customer_id: memberId,
          customer_email: memberDetails?.email || "",
          customer_phone: memberDetails?.mobileno || "",
          customer_name: memberDetails?.Name || ""
        },
        notes: {
          isLoanRepayment: true
        }
      };

      return await createPaymentOrder.mutateAsync(paymentData);
    },

    onSuccess: (data: CreateOrderResponse) => {
      console.log("✅ Loan repayment initiated successfully:", data);
      // The actual payment flow is handled in useCreatePaymentOrder's onSuccess
    },

    onError: (error: any) => {
      console.error("❌ Loan repayment failed:", error);
      const errorMessage = error?.message || "Failed to process loan repayment";
      toast.error(errorMessage);
    },
  });
};

// Rest of your existing hooks remain the same...
export const useGetMemberDetails = (userId: string | null) => {
  const { getUser, setUser } = useContext(UserContext);
  return useQuery({
    queryKey: ["memberDetails", userId],
    queryFn: async () => {
      const response = await getUser(userId);
      if (response.success) {
        setUser(response.data);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch member details");
      }
    },
    enabled: !!userId,
  });
};

export const activateMemberPackage = async (memberId: any) => {
  try {
    const response = await put(`/user/activate-package/${memberId}`, {});
    console.log("Package Activated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error activating package:", error.response?.data || error.message);
    throw error;
  }
};

export const useUpdateMember = () => {
  const userId = TokenService.getUserId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await put(`/user/member/${userId}`, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["memberDetails"] });
        return response.data;
      } else {
        console.error("Login failed:", response.message);
      }
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message;
      console.error("Login error:", errorMessage);
      toast.error(errorMessage);
    },
  });
};

export const useGetTransactionDetails = (status = "all") => {
  return useQuery({
    queryKey: ["transactionsWithConfig", status],
    queryFn: async () => {
      const response = await get(`/user/transactions?status=${status}`);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Failed to fetch transactions");
      }
    },
  });
};

export const useGetTicketDetails = (userId: string) => {
  return useQuery({
    queryKey: ["TicketDetails", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await get(`/user/ticket/${userId}`);
      if (response?.success && Array.isArray(response?.tickets)) {
        return response.tickets;
      } else {
        throw new Error(response.message || "Failed to fetch tickets");
      }
    },
    enabled: !!userId,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticketData: any) => {
      return await post("/user/ticket", ticketData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["TicketDetails"] });
        return response.ticket;
      } else {
        throw new Error(response.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create ticket. Please try again.");
    },
  });
};

export const getUsedandUnusedPackages = ({ memberId, status }: { memberId: string | null, status: string }) => {
  return useQuery({
    queryKey: ["usedAndUnusedPackages", memberId, status],
    queryFn: async () => {
      const response = await get("/user/epin", { memberId, status });
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch packages");
      }
    },
  });
};

export const useGetSponsers = (memberId: any) => {
  return useQuery({
    queryKey: ["sponsers", memberId],
    queryFn: async () => {
      const response = await get(`/user/sponsers/${memberId}`);
      if (response.success) {
        return {
          parentUser: response.parentUser,
          sponsoredUsers: response.sponsoredUsers,
        };
      } else {
        throw new Error(response.message || "Failed to fetch sponsers");
      }
    }
  });
};

export const useTransferPackage = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      return await put('/user/transferPackage', data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        console.error("Login failed:", response.message);
      }
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message;
      console.error("Login error:", errorMessage);
      toast.error(errorMessage);
    },
  });
};

export const useGetPackagehistory = () => {
  const memberId = TokenService.getMemberId();
  return useQuery({
    queryKey: ["package-history", memberId],
    queryFn: async () => {
      const response = await get('/user/package-history');
      if (response.success) {
        return response.epins;
      } else {
        throw new Error(response.message || "Failed to fetch package history");
      }
    }
  });
};

export const useCheckSponsorReward = (memberId: any) => {
  return useQuery({
    queryKey: ["checkSponsorReward", memberId],
    queryFn: async () => {
      if (!memberId) return Promise.resolve({});
      const response = await get(`/user/check-sponsor-reward/${memberId}`);
      return response;
    },
    enabled: !!memberId,
  });
};

export const useGetWalletOverview = (memberId: any) => {
  return useQuery({
    queryKey: ["walletOverview", memberId],
    queryFn: async () => {
      const response = await get(`/user/overview/${memberId}`);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch wallet overview");
      }
    },
    enabled: !!memberId,
  });
};

export const useWalletWithdraw = (memberId: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { memberId: string; amount: string }) => {
      return await post(`user/withdraw/${memberId}`, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["walletOverview"] });
        return response.data;
      } else {
        throw new Error(response.message || "Withdrawal failed");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to process withdrawal";
      toast.error(errorMessage);
    },
  });
};

export const useGetMultiLevelSponsorship = () => {
  return useQuery({
    queryKey: ["multiLevelSponsors"],
    queryFn: async () => {
      const response = await get('/user/multi-level-sponsors');
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch multi-level sponsorship data");
      }
    }
  });
};

export const useActivatePackage = () => {
  return useMutation({
    mutationFn: async (data: { memberId: string; packageType: string }) => {
      const response = await put(`/user/activate-package/${data.memberId}`, {
        packageType: data.packageType,
        activatedAt: new Date().toISOString()
      });
      if (response.success && (response.data?.commissions || response.commissions)) {
        console.log("Commission data received:", response.data?.commissions || response.commissions);
      }
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Package activated successfully!");
      } else {
        const errorMessage = response.message || "Activation failed";
        console.error("Activation failed:", errorMessage);
        toast.error(errorMessage);
      }
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred";
      console.error("Activation error:", errorMessage, err);
      toast.error(errorMessage);
    },
  });
};

export const useImageKitUpload = (username: string) => {
  return useMutation<{ url: string }, Error, File>({
    mutationFn: async (file: File) => {
      const authRes = await get("/image-kit-auth");
      const { signature, expire, token } = authRes;

      const data = new FormData();
      data.append("file", file);
      data.append("fileName", username);
      data.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      data.append("signature", signature);
      data.append("expire", expire);
      data.append("token", token);
      data.append("folder", "/mscs-profile-images");

      const uploadRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        data
      );

      return uploadRes.data;
    },
  });
};

export const useGetPendingWithdrawals = () => {
  return useQuery({
    queryKey: ["withdrawals", "pending"],
    queryFn: async () => {
      const response = await get("/user/trasactions/Pending");
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch pending withdrawals");
      }
    }
  });
};

export const useGetApprovedWithdrawals = () => {
  return useQuery({
    queryKey: ["withdrawals", "completed"],
    queryFn: async () => {
      const response = await get("/user/trasactions/Completed");
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch completed withdrawals");
      }
    }
  });
};

export const useApproveWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      return await put(`/user/approve-withdrawal/${transactionId}`);
    },
    onMutate: async (transactionId) => {
      await queryClient.cancelQueries({ queryKey: ['withdrawals', 'pending'] });

      const previousPending = queryClient.getQueryData(['withdrawals', 'pending']);

      queryClient.setQueryData(['withdrawals', 'pending'], (old: any) =>
        old ? old.filter((t: any) => t.transaction_id !== transactionId) : old
      );

      return { previousPending };
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["withdrawals", "completed"] });
      } else {
        toast.error(response.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals', 'pending'] });
    },
  });
};

export const useGetlevelbenifits = (memberId: any) => {
  return useQuery({
    queryKey: ["level-benifits", memberId],
    queryFn: async () => {
      const response = await get(`/user/level-benefits/${memberId}`);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch level-benifits data");
      }
    }
  });
};

export const useGetDailyPayout = (memberId: any) => {
  return useQuery({
    queryKey: ["daily-payout", memberId],
    queryFn: async () => {
      const response = await get(`/user/daily-payout/${memberId}`);
      console.log('API res:', response);
      if (response?.success) {
        return response?.data?.daily_earnings || [];
      } else {
        throw new Error(response.data?.message || "Failed to fetch daily payout data");
      }
    },
    enabled: !!memberId,
  });
};

export const useClimeLoan = () => {
  return useMutation({
    mutationFn: async ({ memberId, data }: { memberId: string; data: any }) => {
      const response = await post(`/user/clime-reward-loan/${memberId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to claim reward loan.";
      toast.error(errorMsg);
      console.error("Error in useClimeLoan:", error);
    },
  });
};

// NOTE: Webhooks are handled server-to-server by the payment gateway calling our backend.
// The frontend should use useVerifyPayment to check payment status after redirect.

// Utility function to handle payment redirect URL parameters
export const parsePaymentRedirectParams = (searchParams: URLSearchParams) => {
  return {
    payment_status: searchParams.get("payment_status") as PaymentStatus | null,
    order_id: searchParams.get("order_id"),
    member_id: searchParams.get("member_id"),
  };
};

export const useSubmitKYC = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      return await post("/kyc/submit", data);
    },
    onSuccess: () => {
      toast.success("KYC submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};
