import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import TokenService from '../api/token/tokenService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5051";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentUserId = TokenService.getMemberId();
    if (!currentUserId) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected! Emitting join for:", currentUserId);
      newSocket.emit("join", currentUserId);
    });

    newSocket.on("receiveMessage", () => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    });

    newSocket.on("new_message_notification", (data: any) => {
      console.log("Received new_message_notification!", data);
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      
      console.log("Showing toast popup");
      toast(
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            backgroundColor: '#2c8786', 
            color: 'white', 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {data.senderName ? data.senderName[0].toUpperCase() : 'A'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '15px', marginBottom: '2px' }}>
              {data.senderName || 'Admin'}
            </div>
            <div style={{ color: '#555', fontSize: '13px' }}>
              {data.text || 'Sent an attachment'}
            </div>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClick: () => {
            navigate('/user/chat', { state: { activeRoomId: data.roomId } });
          },
          style: {
            borderRadius: '12px',
            borderLeft: '6px solid #2c8786',
            backgroundColor: '#f8fdfc',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
            padding: '12px',
            cursor: 'pointer'
          }
        }
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [location.pathname, queryClient]); 

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
