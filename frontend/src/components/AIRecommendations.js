import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingDown, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRec, setSelectedRec] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
  `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/recommendations`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);


      if (response.data.success) {
        setRecommendations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'No calculations found');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Transportation': return '🚗';
      case 'Home Energy': return '⚡';
      case 'Food & Diet': return '🥗';
      case 'Shopping': return '🛍️';
      case 'Waste Management': return '♻️';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Generating AI recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Recommendations Yet</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
          <p className="text-gray-600 text-sm">Personalized actions to reduce your carbon footprint</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {recommendations.filter(r => r.priority === 'HIGH').length}
          </div>
          <div className="text-xs text-red-700">High Priority</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {recommendations.filter(r => r.priority === 'MEDIUM').length}
          </div>
          <div className="text-xs text-yellow-700">Medium Priority</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {recommendations.reduce((sum, r) => sum + parseFloat(r.savings), 0).toFixed(0)}
          </div>
          <div className="text-xs text-green-700">kg CO₂/year potential savings</div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedRec?.id === rec.id ? 'border-primary bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedRec(selectedRec?.id === rec.id ? null : rec)}
          >
            {/* Recommendation Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">{getCategoryIcon(rec.category)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600">{rec.category}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{rec.description}</p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full border-2 font-semibold ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} PRIORITY
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border-2 border-green-300 font-semibold">
                    💰 {rec.cost} Cost
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-2 border-blue-300 font-semibold">
                    ⏱️ {rec.difficulty}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 border-2 border-purple-300 font-semibold">
                    📅 {rec.timeframe}
                  </span>
                </div>

                {/* Impact */}
                <div className="mt-3 flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-600">{rec.impact}</span>
                  <span className="text-sm text-gray-600">({rec.savings} kg/year)</span>
                </div>
              </div>

              <ChevronRight 
                className={`w-6 h-6 text-gray-400 transition-transform ${
                  selectedRec?.id === rec.id ? 'rotate-90' : ''
                }`}
              />
            </div>

            {/* Expanded Details */}
            {selectedRec?.id === rec.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Action Steps:
                </h4>
                <ol className="space-y-2">
                  {rec.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>

                {rec.paybackPeriod && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      💡 <strong>Payback Period:</strong> {rec.paybackPeriod}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-gray-700 text-center">
          🤖 <strong>AI Insight:</strong> These recommendations are tailored to your specific carbon footprint. 
          Implementing the top 3 could reduce your emissions by up to{' '}
          <strong className="text-primary">
            {recommendations.slice(0, 3).reduce((sum, r) => sum + parseFloat(r.savings), 0).toFixed(0)} kg CO₂/year
          </strong>!
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations;