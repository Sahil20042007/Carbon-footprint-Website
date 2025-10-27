import React, { useContext } from 'react';
import { Trophy, Medal, Award, TrendingDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Leaderboard = ({ userFootprint }) => {
  const { user } = useContext(AuthContext);

  // Mock leaderboard data (in real app, fetch from backend)
  const leaderboardData = [
    { name: 'Priya Sharma', footprint: 245, badge: '🌟', city: 'Mumbai' },
    { name: 'Raj Patel', footprint: 289, badge: '🌱', city: 'Delhi' },
    { name: 'Ananya Singh', footprint: 312, badge: '♻️', city: 'Bangalore' },
    { name: 'Vikram Kumar', footprint: 334, badge: '🌿', city: 'Pune' },
    { name: 'Neha Reddy', footprint: 356, badge: '🍃', city: 'Hyderabad' },
    { name: user?.name || 'You', footprint: userFootprint || 0, badge: '✨', city: 'Your City', isCurrentUser: true },
    { name: 'Arjun Gupta', footprint: 398, badge: '🌾', city: 'Chennai' },
    { name: 'Sneha Joshi', footprint: 421, badge: '🌳', city: 'Kolkata' },
    { name: 'Rohit Desai', footprint: 445, badge: '🌴', city: 'Ahmedabad' },
    { name: 'Kavya Iyer', footprint: 467, badge: '🌲', city: 'Kochi' },
  ].sort((a, b) => a.footprint - b.footprint);

  // Find user's rank
  const userRank = leaderboardData.findIndex(u => u.isCurrentUser) + 1;

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-600" />;
    return <Award className="w-5 h-5 text-gray-400" />;
  };

  const getRankBadge = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Eco Leaderboard</h2>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-600">
            Your Rank: #{userRank}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboardData.slice(0, 10).map((entry, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-lg transition ${
              entry.isCurrentUser
                ? 'bg-gradient-to-r from-green-100 to-blue-100 border-2 border-primary'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Rank */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(index)} text-white font-bold`}>
                {index < 3 ? (
                  getRankIcon(index)
                ) : (
                  <span className="text-gray-600">#{index + 1}</span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {entry.name}
                  </span>
                  <span className="text-xl">{entry.badge}</span>
                  {entry.isCurrentUser && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                      YOU
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{entry.city}</p>
              </div>

              {/* Footprint */}
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  {entry.footprint} kg
                </p>
                <p className="text-xs text-gray-500">CO₂/month</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>🏆 Top performers</strong> have the lowest carbon footprint! 
          Keep reducing your emissions to climb the leaderboard and inspire others.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;