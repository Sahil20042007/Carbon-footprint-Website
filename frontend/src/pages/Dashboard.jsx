import DidYouKnow from '../components/DidYouKnow.jsx';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { calculationAPI } from '../utils/api';
import ResultDashboard from '../components/ResultDashboard';
import { Calculator, History, Loader } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Leaderboard from '../components/LeaderBoards.jsx';
import CarbonGoals from '../components/CarbonGoals.jsx';
import StreakCounter from '../components/StreakCounter.jsx';
import CarbonNews from '../components/CarbonNews.jsx';
import ImpactCalculator from '../components/ImpactCalculator.jsx';

const Dashboard = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestCalculation, setLatestCalculation] = useState(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    fetchCalculations();
    
    // Check if there's a new calculation from navigation state
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Track your carbon footprint and make a positive impact on the environment
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/calculator"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition flex items-center space-x-4 group"
          >
            <Calculator className="w-12 h-12 group-hover:scale-110 transition" />
            <div>
              <h3 className="text-xl font-bold">New Calculation</h3>
              <p className="text-sm opacity-90">Calculate your carbon footprint</p>
            </div>
          </Link>

          <Link
            to="/history"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition flex items-center space-x-4 group border-2 border-primary"
          >
            <History className="w-12 h-12 text-primary group-hover:scale-110 transition" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">View History</h3>
              <p className="text-sm text-gray-600">See your past calculations</p>
            </div>
          </Link>
        </div>
        {/* Did You Know Section */}
<div className="mb-8">
  <DidYouKnow />
</div>
{/* Gamification Section */}
{latestCalculation && (
  <div className="grid md:grid-cols-2 gap-8 mb-8">
    <StreakCounter />
    <CarbonGoals currentFootprint={latestCalculation.results.total} />
  </div>
)}

{/* Leaderboard */}
{latestCalculation && (
  <div className="mb-8">
    <Leaderboard userFootprint={latestCalculation.results.total} />
  </div>
)
}
{/* Educational Content Grid */}
{latestCalculation && (
  <div className="grid lg:grid-cols-2 gap-8 mb-8">
    <CarbonNews />
    <ImpactCalculator userFootprint={latestCalculation.results.total} />
  </div>
)}
        {/* Latest Calculation Results */}
        {latestCalculation ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Your Latest Results</h2>
              <p className="text-sm text-gray-600">
                Calculated on {new Date(latestCalculation.calculatedAt).toLocaleDateString()}
              </p>
            </div>
            <ResultDashboard calculation={latestCalculation} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calculator className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Calculations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking your carbon footprint by creating your first calculation
            </p>
            <Link
              to="/calculator"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition flex items-center space-x-4 group"
            >
              Start Calculating
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;