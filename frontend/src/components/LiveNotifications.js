import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Transition } from '@headlessui/react'; // If you don't have this, we'll use simple CSS below

const LiveNotifications = () => {
  const socket = useSocket();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for the 'new_offset' event from the backend
    socket.on('new_offset', (data) => {
      console.log("🔔 Notification Received:", data);
      setNotification(data);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    // Cleanup listener when component unmounts
    return () => {
      socket.off('new_offset');
    };
  }, [socket]);

  // If no notification, render nothing
  if (!notification) return null;

  return (
    <div className="fixed top-24 right-5 z-50 animate-bounce-in">
      <div className="bg-white dark:bg-gray-800 border-l-4 border-green-500 shadow-lg rounded-lg p-4 max-w-sm flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">🌱</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
            Carbon Offset Alert!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
        <button 
          onClick={() => setNotification(null)}
          className="ml-auto pl-3 text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default LiveNotifications;