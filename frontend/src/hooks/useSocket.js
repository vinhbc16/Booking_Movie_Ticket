import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // URL Backend 

export const useSocket = (showtimeId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Kết nối
    socketRef.current = io(SOCKET_URL, {
        withCredentials: true, // Nếu cần cookie
        transports: ['websocket'] // Ưu tiên websocket cho nhanh
    });

    // 2. Join Room (Suất chiếu)
    if (showtimeId) {
        socketRef.current.emit('join_showtime', showtimeId);
    }

    // 3. Cleanup khi rời trang
    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };
  }, [showtimeId]);

  return socketRef.current;
};