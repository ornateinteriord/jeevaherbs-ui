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

import axios from "axios";

// Delete a message
export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await api.delete(`/api/chat/message/${messageId}`);
      return response.data;
    },
    // We don't invalidate queries here aggressively because socket handles the real-time removal
    // but it's safe to invalidate if needed.
  });
};

// Upload file via ImageKit
export const useImageKitUpload = () => {
  return useMutation<{ url: string, name: string, size: number }, Error, File>({
    mutationFn: async (file: File) => {
      const authRes = await api.get("/image-kit-auth");
      const { signature, expire, token } = authRes.data || authRes;

      const data = new FormData();
      data.append("file", file);
      data.append("fileName", file.name);
      data.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      data.append("signature", signature);
      data.append("expire", expire);
      data.append("token", token);
      data.append("folder", "/chat-uploads");

      const uploadRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        data
      );

      return uploadRes.data;
    },
  });
};
