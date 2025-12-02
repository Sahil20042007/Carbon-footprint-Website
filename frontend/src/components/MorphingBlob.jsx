import React from 'react';

const MorphingBlob = ({ color = 'green', size = 'large', position = 'top-left' }) => {
  const sizeClasses = {
    small: 'w-64 h-64',
    medium: 'w-96 h-96',
    large: 'w-128 h-128'
  };

  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const colorClasses = {
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    pink: 'bg-pink-400',
    orange: 'bg-orange-400'
  };

  return (
    <div className={`absolute ${positionClasses[position]} ${sizeClasses[size]} ${colorClasses[color]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-morph`}>
      <style>{`
        @keyframes morph {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          25% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          50% {
            border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
          }
          75% {
            border-radius: 60% 40% 60% 40% / 70% 40% 50% 60%;
          }
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MorphingBlob;