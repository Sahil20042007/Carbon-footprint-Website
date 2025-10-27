import React, { useState, useEffect } from 'react';
import { calculationAPI } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, TrendingDown, Trash2, Loader } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const History = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalculation, setSelectedCalculation] = useState(null);

  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    try {
      const response = await calculationAPI.getAll();
      if (response.data.success) {
        setCalculations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      try {
        await calculationAPI.delete(id);
        setCalculations(calculations.filter(calc => calc._id !== id));
        if (selectedCalculation?._id === id) {
          setSelectedCalculation(null);
        }
      } catch (error) {
        console.error('Error deleting calculation:', error);
        alert('Failed to delete calculation');
      }
    }
  };

  // Prepare data for line chart
  const chartData = calculations
    .slice()
    .reverse()
    .map(calc => ({
      date: new Date(calc.calculatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: parseFloat(calc.results.total.toFixed(2)),
    }));

  if (loading) {
  return <LoadingSpinner message="Loading your calculation history..." />;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calculation History</h1>
          <p className="text-gray-600">Track your carbon footprint over time</p>
        </div>

        {calculations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-600">Your calculation history will appear here</p>
          </div>
        ) : (
          <>
            {/* Trend Chart */}
            {calculations.length > 1 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingDown className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">Progress Trend</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="CO₂ (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Calculations List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">All Calculations</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {calculations.map((calc) => (
                  <div
                    key={calc._id}
                    className="p-6 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedCalculation(selectedCalculation?._id === calc._id ? null : calc)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-lg font-semibold text-gray-900">
                            {new Date(calc.calculatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                          <StatItem label="Total" value={`${calc.results.total.toFixed(2)} kg`} />
                          <StatItem label="Transport" value={`${calc.results.transportation.toFixed(2)} kg`} />
                          <StatItem label="Energy" value={`${calc.results.homeEnergy.toFixed(2)} kg`} />
                          <StatItem label="Food" value={`${calc.results.food.toFixed(2)} kg`} />
                          <StatItem label="Shopping" value={`${calc.results.shopping.toFixed(2)} kg`} />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(calc._id);
                        }}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {selectedCalculation?._id === calc._id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Detailed Breakdown</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <DetailCard title="Transportation">
                            <p>Car: {calc.transportation.carKm} km ({calc.transportation.carType})</p>
                            <p>Public Transport: {calc.transportation.publicTransportKm} km</p>
                            <p>Flights: {calc.transportation.flightShortHaul + calc.transportation.flightLongHaul} trips</p>
                          </DetailCard>
                          
                          <DetailCard title="Home Energy">
                            <p>Electricity: {calc.homeEnergy.electricityKwh} kWh</p>
                            <p>Natural Gas: {calc.homeEnergy.naturalGasKwh} kWh</p>
                            <p>Renewable: {calc.homeEnergy.renewableEnergy ? 'Yes' : 'No'}</p>
                          </DetailCard>
                          
                          <DetailCard title="Food & Diet">
                            <p>Meat: {calc.food.meatFrequency}</p>
                            <p>Dairy: {calc.food.dairyFrequency}</p>
                            <p>Local Food: {calc.food.localFood ? 'Yes' : 'No'}</p>
                          </DetailCard>
                          
                          <DetailCard title="Shopping">
                            <p>Clothing: {calc.shopping.clothingItemsPerMonth} items/month</p>
                            <p>Electronics: {calc.shopping.electronicsPerYear} items/year</p>
                            <p>Online Orders: {calc.shopping.onlineOrdersPerMonth}/month</p>
                          </DetailCard>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

const DetailCard = ({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <div className="text-sm text-gray-600 space-y-1">{children}</div>
  </div>
);

export default History;