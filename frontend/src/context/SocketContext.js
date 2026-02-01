import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

// Custom hook to use the socket easily in other components
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // [IMPORTANT] Replace with your backend URL
    // If testing locally, use http://localhost:5000
    // If deployed, use your Railway URL
    const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    const newSocket = io(URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'] // Try websocket first
    });

    setSocket(newSocket);

    // Cleanup on unmount (closes connection)
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};