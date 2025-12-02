import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { calculationAPI } from '../utils/api';
import ResultDashboard from '../components/ResultDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import DidYouKnow from '../components/DidYouKnow';
import Leaderboard from '../components/LeaderBoards';
import CarbonGoals from '../components/CarbonGoals';
import StreakCounter from '../components/StreakCounter';
import CarbonNews from '../components/CarbonNews';
import ImpactCalculator from '../components/ImpactCalculator';
import Earth3D from '../components/Earth3D';
import Chart3D from '../components/Chart3D';
import ParticleBackground from '../components/ParticleBackground';
import FloatingBadges from '../components/FloatingBadges';
import MorphingBlob from '../components/MorphingBlob';
import { Calculator, History, TrendingUp, Sparkles, Zap, Star } from 'lucide-react';
import AIRecommendations from '../components/AIRecommendations';
import CarbonOffsetMarketplace from '../components/CarbonOffsetMarketPlace';
import CommunityForum from '../components/CommunityForum';

const Dashboard = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestCalculation, setLatestCalculation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    fetchCalculations();
    setIsVisible(true);
    
    if (location.state?.newCalculation) {
      setLatestCalculation(location.state.newCalculation);
    }
  }, [location]);

  const fetchCalculations = async () => {
    try {
      const response = await calculationAPI.getAll();
      if (response.data.success) {
        setCalculations(response.data.data);
        if (response.data.data.length > 0 && !latestCalculation) {
          setLatestCalculation(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-float" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="absolute w-3 h-3 bg-blue-400 rounded-full animate-float" style={{ top: '20%', right: '15%', animationDelay: '2s' }}></div>
        <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-float" style={{ bottom: '30%', left: '20%', animationDelay: '4s' }}></div>
        <div className="absolute w-3 h-3 bg-pink-400 rounded-full animate-float" style={{ bottom: '20%', right: '25%', animationDelay: '6s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Welcome Header with Animation */}
        <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                    <h1 className="text-4xl font-bold text-white">
                      Welcome back, {user?.name}!
                    </h1>
                  </div>
                  <p className="text-white text-opacity-90 text-lg">
                    Track your journey to a sustainable future 🌍
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="text-3xl font-bold text-white">{calculations.length}</div>
                    <div className="text-sm text-white text-opacity-80">Calculations</div>
                  </div>
                  <div className="text-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="text-3xl font-bold text-white">
                      <Star className="w-8 h-8 inline text-yellow-300" />
                    </div>
                    <div className="text-sm text-white text-opacity-80">Eco Warrior</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)">
                  <animate attributeName="d" dur="10s" repeatCount="indefinite"
                    values="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z;
                            M0,50 C150,0 350,100 600,50 C850,0 1050,100 1200,50 L1200,120 L0,120 Z;
                            M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" />
                </path>
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Actions with 3D Effect */}
        <div className={`grid md:grid-cols-2 gap-6 mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link
            to="/calculator"
            className="group relative bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-4 bg-white bg-opacity-20 rounded-xl group-hover:rotate-12 transition-transform">
                <Calculator className="w-12 h-12 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">New Calculation</h3>
                <p className="text-sm opacity-90">Calculate your carbon footprint</p>
              </div>
              <Zap className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:text-yellow-300 transition-all" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white opacity-5 rounded-full group-hover:scale-150 transition-transform"></div>
          </Link>

          <Link
            to="/history"
            className="group relative bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-4 bg-white bg-opacity-20 rounded-xl group-hover:rotate-12 transition-transform">
                <History className="w-12 h-12 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">View History</h3>
                <p className="text-sm opacity-90">See your past calculations</p>
              </div>
              <TrendingUp className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-all" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white opacity-5 rounded-full group-hover:scale-150 transition-transform"></div>
          </Link>
        </div>

        {/* Did You Know Section */}
        <div className={`mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <DidYouKnow />
        </div>

        {/* 3D VISUALIZATIONS - NEW SECTION */}
        {latestCalculation && (
          <div className={`grid lg:grid-cols-2 gap-8 mb-8 transform transition-all duration-1000 delay-350 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* 3D Earth */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🌍 Your Carbon Impact Visualization
              </h3>
              <Earth3D footprint={latestCalculation.results.perYear} />
            </div>

            {/* 3D Chart */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                📊 Interactive 3D Breakdown
              </h3>
              <Chart3D 
                data={[
                  { name: 'Transport', value: latestCalculation.results.transportation },
                  { name: 'Energy', value: latestCalculation.results.homeEnergy },
                  { name: 'Food', value: latestCalculation.results.food },
                  { name: 'Shopping', value: latestCalculation.results.shopping },
                  { name: 'Waste', value: latestCalculation.results.waste }
                ]}
              />
            </div>
          </div>
        )}

        {/* Gamification Section */}
        {latestCalculation && (
          <div className={`grid md:grid-cols-2 gap-8 mb-8 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <StreakCounter />
            <CarbonGoals currentFootprint={latestCalculation.results.total} />
          </div>
        )}

        {/* Leaderboard */}
        {latestCalculation && (
          <div className={`mb-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Leaderboard userFootprint={latestCalculation.results.total} />
          </div>
        )}
        {/* AI Recommendations */}
          {latestCalculation && (
            <div className={`mb-8 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <AIRecommendations />
            </div>
          )}
          {/* Carbon Offset Marketplace */}
            {latestCalculation && (
              <div className={`mb-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <CarbonOffsetMarketplace />
              </div>
            )}
            {/* Community Forum */}
              <div className={`mb-8 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <CommunityForum />
              </div>

        {/* Educational Content Grid */}
        {latestCalculation && (
          <div className={`grid lg:grid-cols-2 gap-8 mb-8 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <CarbonNews />
            <ImpactCalculator userFootprint={latestCalculation.results.total} />
          </div>
        )}

        {/* Latest Calculation Results */}
        {latestCalculation ? (
          <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Your Latest Results
              </h2>
              <p className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow">
                📅 {new Date(latestCalculation.calculatedAt).toLocaleDateString()}
              </p>
            </div>
            <ResultDashboard calculation={latestCalculation} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center transform transition-all duration-1000 delay-700">
            <div className="inline-block p-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-6">
              <Calculator className="w-20 h-20 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              No Calculations Yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start tracking your carbon footprint by creating your first calculation
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Zap className="w-5 h-5" />
              Start Calculating
            </Link>
          </div>
        )}
      </div>

      {/* PARTICLE BACKGROUND - NEW */}
      <ParticleBackground particleCount={30} color="#10b981" />
      
      {/* MORPHING BLOBS - NEW */}
      <MorphingBlob color="green" size="large" position="top-left" />
      <MorphingBlob color="blue" size="medium" position="bottom-right" />
      
      {/* FLOATING BADGES - NEW */}
      {latestCalculation && (
        <FloatingBadges achievements={['first_calculation', 'week_streak']} />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .bg-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;