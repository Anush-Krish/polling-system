import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const coupleIdRef = useRef(null);

  useEffect(() => {
    const coupleId = localStorage.getItem('coupleId');
    const coupleToken = localStorage.getItem('coupleToken');

    if (!coupleId || !coupleToken) {
      console.warn('SocketProvider: coupleId or coupleToken not found in localStorage. Skipping socket connection.');
      return;
    }

    coupleIdRef.current = coupleId;

    // Determine the Socket.IO server URL
    const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL ? 
      import.meta.env.VITE_API_URL.replace('/api', '') : 
      'http://localhost:5001';

    const newSocket = io(SOCKET_SERVER_URL, {
      query: { coupleId, token: coupleToken },
      transports: ['websocket'],
      auth: {
        token: coupleToken
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected:', newSocket.id);
      // Join a room specific to the couple
      newSocket.emit('joinCoupleRoom', coupleId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leaveCoupleRoom', coupleIdRef.current);
        newSocket.disconnect();
      }
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
