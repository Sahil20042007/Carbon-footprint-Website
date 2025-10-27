import React from 'react';
import { Loader, Leaf } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Outer spinning circle */}
          <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          
          {/* Inner icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
        
        <h3 className="mt-6 text-xl font-semibold text-gray-800">{message}</h3>
        <p className="mt-2 text-gray-600">Please wait a moment...</p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;