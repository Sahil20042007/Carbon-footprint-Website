import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Award } from 'lucide-react';

const StreakCounter = () => {
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('carbonStreak');
    return saved ? JSON.parse(saved) : {
      current: 0,
      longest: 0,
      lastCalculation: null,
    };
  });

  useEffect(() => {
    // Check if user calculated today
    const today = new Date().toDateString();
    const lastCalc = streak.lastCalculation;

    if (lastCalc !== today) {
      // Check if it's consecutive day
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastCalc === yesterday) {
        // Consecutive day - increment streak
        const newCurrent = streak.current + 1;
        const newStreak = {
          current: newCurrent,
          longest: Math.max(newCurrent, streak.longest),
          lastCalculation: today,
        };
        setStreak(newStreak);
        localStorage.setItem('carbonStreak', JSON.stringify(newStreak));
      } else if (lastCalc && lastCalc !== today) {
        // Streak broken
        const newStreak = {
          current: 1,
          longest: streak.longest,
          lastCalculation: today,
        };
        setStreak(newStreak);
        localStorage.setItem('carbonStreak', JSON.stringify(newStreak));
      } else {
        // First calculation
        const newStreak = {
          current: 1,
          longest: 1,
          lastCalculation: today,
        };
        setStreak(newStreak);
        localStorage.setItem('carbonStreak', JSON.stringify(newStreak));
      }
    }
  }, []);

  const getStreakMessage = () => {
    if (streak.current === 0) return "Start your streak today!";
    if (streak.current === 1) return "Great start! Keep it going!";
    if (streak.current < 7) return "You're on fire! 🔥";
    if (streak.current < 30) return "Incredible dedication!";
    return "You're a sustainability champion!";
  };

  const getStreakColor = () => {
    if (streak.current === 0) return "from-gray-400 to-gray-600";
    if (streak.current < 7) return "from-orange-400 to-red-500";
    if (streak.current < 30) return "from-purple-400 to-pink-500";
    return "from-yellow-400 to-orange-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Flame className="w-8 h-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Your Streak</h2>
      </div>

      <div className={`bg-gradient-to-r ${getStreakColor()} rounded-lg p-8 text-white text-center mb-6`}>
        <Flame className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <div className="text-6xl font-bold mb-2">{streak.current}</div>
        <div className="text-xl font-semibold mb-2">Day Streak 🔥</div>
        <div className="text-sm opacity-90">{getStreakMessage()}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Current Streak</p>
          <p className="text-2xl font-bold text-blue-600">{streak.current} days</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Longest Streak</p>
          <p className="text-2xl font-bold text-purple-600">{streak.longest} days</p>
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Milestones</h3>
        <div className="space-y-2">
          <MilestoneBadge achieved={streak.longest >= 3} days={3} emoji="🌱" title="Eco Beginner" />
          <MilestoneBadge achieved={streak.longest >= 7} days={7} emoji="🌿" title="Week Warrior" />
          <MilestoneBadge achieved={streak.longest >= 14} days={14} emoji="🌳" title="Two Week Champion" />
          <MilestoneBadge achieved={streak.longest >= 30} days={30} emoji="🏆" title="Monthly Master" />
          <MilestoneBadge achieved={streak.longest >= 100} days={100} emoji="👑" title="Sustainability King" />
        </div>
      </div>

      {/* Motivation */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          💡 <strong>Tip:</strong> Calculate your carbon footprint daily to maintain your streak 
          and track your progress over time!
        </p>
      </div>
    </div>
  );
};

const MilestoneBadge = ({ achieved, days, emoji, title }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${
    achieved ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'
  }`}>
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className={`font-semibold ${achieved ? 'text-green-800' : 'text-gray-500'}`}>
          {title}
        </p>
        <p className="text-xs text-gray-600">{days} days</p>
      </div>
    </div>
    {achieved && (
      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">✓</span>
      </div>
    )}
  </div>
);

export default StreakCounter;