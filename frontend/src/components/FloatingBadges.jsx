import React, { useState, useEffect } from 'react';
import { Award, Star, Trophy, Target, Zap, Crown } from 'lucide-react';

const FloatingBadges = ({ achievements = [] }) => {
  const [badges, setBadges] = useState([]);

  const badgeIcons = {
    first_calculation: { icon: Star, color: 'from-yellow-400 to-orange-500', label: 'First Steps' },
    week_streak: { icon: Zap, color: 'from-orange-400 to-red-500', label: 'Week Warrior' },
    eco_champion: { icon: Trophy, color: 'from-green-400 to-teal-500', label: 'Eco Champion' },
    goal_achiever: { icon: Target, color: 'from-blue-400 to-purple-500', label: 'Goal Master' },
    top_ten: { icon: Crown, color: 'from-purple-400 to-pink-500', label: 'Top 10' },
    carbon_neutral: { icon: Award, color: 'from-teal-400 to-cyan-500', label: 'Carbon Neutral' }
  };

  useEffect(() => {
    // Simulate achievement unlocks
    const timer = setTimeout(() => {
      if (achievements.length > 0) {
        achievements.forEach((achievement, index) => {
          setTimeout(() => {
            showBadge(achievement);
          }, index * 2000);
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [achievements]);

  const showBadge = (achievementType) => {
    const badge = badgeIcons[achievementType];
    if (!badge) return;

    const newBadge = {
      id: Date.now() + Math.random(),
      ...badge,
      type: achievementType
    };

    setBadges(prev => [...prev, newBadge]);

    // Remove badge after animation
    setTimeout(() => {
      setBadges(prev => prev.filter(b => b.id !== newBadge.id));
    }, 5000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {badges.map((badge, index) => (
        <FloatingBadge
          key={badge.id}
          badge={badge}
          index={index}
        />
      ))}
    </div>
  );
};

const FloatingBadge = ({ badge, index }) => {
  const Icon = badge.icon;
  const startX = Math.random() * 80 + 10; // 10-90% from left

  return (
    <div
      className="absolute animate-float-up"
      style={{
        left: `${startX}%`,
        bottom: '-100px',
        animationDelay: `${index * 0.5}s`
      }}
    >
      <div className={`relative bg-gradient-to-br ${badge.color} rounded-2xl p-6 shadow-2xl transform hover:scale-110 transition-transform`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white opacity-20 rounded-2xl animate-pulse"></div>
        
        {/* Badge content */}
        <div className="relative z-10 text-center">
          <div className="bg-white bg-opacity-30 rounded-full p-4 inline-block mb-3">
            <Icon className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-white font-bold text-xl mb-1">Achievement Unlocked!</h3>
          <p className="text-white text-opacity-90 font-semibold">{badge.label}</p>
        </div>

        {/* Sparkles */}
        <div className="absolute -top-2 -right-2 text-3xl animate-spin-slow">✨</div>
        <div className="absolute -bottom-2 -left-2 text-3xl animate-spin-slow animation-delay-1000">✨</div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateY(-50px) scale(1);
            opacity: 1;
          }
          90% {
            transform: translateY(-400px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-450px) scale(0);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float-up {
          animation: float-up 5s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default FloatingBadges;