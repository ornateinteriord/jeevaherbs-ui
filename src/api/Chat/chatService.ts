import api from "../Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch all rooms
export const useGetRooms = () => {
  return useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await api.get("/api/chat/rooms");
      return response.data;
    },
  });
};

// Fetch messages for a specific room
export const useGetMessages = (roomId: string) => {
  return useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: async () => {
      if (!roomId) return { data: [] };
      const response = await api.get(`/api/chat/messages/${roomId}`);
      return response.data;
    },
    enabled: !!roomId,
  });
};

// Search member by mobile number
export const useSearchMember = () => {
  return useMutation({
    mutationFn: async (mobileNumber: string) => {
      const response = await api.get(`/api/chat/search?mobileNumber=${mobileNumber}`);
      return response.data;
    },
  });
};

// Send message
export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (messageData: { roomId: string; text?: string; imageUrl?: string; messageType?: string }) => {
      const response = await api.post("/api/chat/message/send", messageData);
      return response.data;
    },
  });
};

// Mark as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await api.patch(`/api/chat/mark-read/${roomId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });
};

// Get Support Chat
export const useGetSupportChat = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get("/api/chat/support");
      return response.data;
    },
  });
};
