import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => { 
  const socketRef = useRef(null);

  useEffect(() => {
    // Chỉ khởi tạo 1 lần
    if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            autoConnect: false // Tắt tự kết nối để ta kiểm soát ở BookingPage
        });
    }

    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null; // Reset ref khi unmount
        }
    };
  }, []);

  return socketRef.current;
};