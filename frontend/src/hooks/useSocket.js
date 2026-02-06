import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => { 
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize only once
    if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            autoConnect: false // Disable auto-connect to control in BookingPage
        });
    }

    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null; // Reset ref on unmount
        }
    };
  }, []);

  return socketRef.current;
};