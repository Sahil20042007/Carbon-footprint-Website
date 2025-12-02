import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Target, Lightbulb, Award, Trees, Download, Share2 } from 'lucide-react';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import SocialShare from './SocialShare';

const ResultDashboard = ({ calculation }) => {
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'yearly'

  // IMPORTANT: useEffect MUST be at the top, before any conditional returns
  useEffect(() => {
    if (calculation && calculation.results) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [calculation]);

  // NOW we can do conditional checks
  if (!calculation || !calculation.results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No calculation data available</p>
        </div>
      </div>
    );
  }

  const { results } = calculation;

  // Calculate display values based on view mode
  const displayResults = viewMode === 'monthly' ? {
    total: results.total,
    transportation: results.transportation,
    homeEnergy: results.homeEnergy,
    food: results.food,
    shopping: results.shopping,
    waste: results.waste,
    perDay: results.perDay
  } : {
    total: results.perYear,
    transportation: results.transportation * 12,
    homeEnergy: results.homeEnergy * 12,
    food: results.food * 12,
    shopping: results.shopping * 12,
    waste: results.waste * 12,
    perDay: results.perYear / 365
  };

  // Calculate trees needed to offset
  const treesNeeded = Math.ceil(results.perYear / 21); // 1 tree absorbs ~21kg CO2/year
  
  // Get achievement badge
  const getAchievement = () => {
    if (results.perYear < 4000) return { icon: '🏆', title: 'Eco Champion', color: 'text-green-600' };
    if (results.perYear < 6000) return { icon: '⭐', title: 'Eco Warrior', color: 'text-blue-600' };
    if (results.perYear < 8100) return { icon: '🌱', title: 'Green Beginner', color: 'text-yellow-600' };
    return { icon: '📈', title: 'Eco Learner', color: 'text-orange-600' };
  };

  const achievement = getAchievement();

  // Fun comparisons
  const getComparisons = () => {
    const phoneCharges = Math.floor(results.perYear / 0.008); // 0.008 kg per charge
    const mumbaiDelhiFlights = Math.floor(results.perYear / 180); // ~180kg per flight
    const beefMeals = Math.floor(results.perYear / 6.61); // 6.61kg per beef meal
    
    return { phoneCharges, mumbaiDelhiFlights, beefMeals };
  };

  const comparisons = getComparisons();

  // Prepare data for Pie Chart
  const pieData = [
    { name: 'Transportation', value: parseFloat(displayResults.transportation.toFixed(2)), color: '#3b82f6' },
    { name: 'Home Energy', value: parseFloat(displayResults.homeEnergy.toFixed(2)), color: '#f59e0b' },
    { name: 'Food', value: parseFloat(displayResults.food.toFixed(2)), color: '#10b981' },
    { name: 'Shopping', value: parseFloat(displayResults.shopping.toFixed(2)), color: '#8b5cf6' },
    { name: 'Waste', value: parseFloat(displayResults.waste.toFixed(2)), color: '#ef4444' },
  ];

  // Prepare data for Bar Chart (Comparison)
  const globalAvg = viewMode === 'monthly' ? 675 : 8100;
  const targetVal = viewMode === 'monthly' ? 333 : 4000;
  
  const barData = [
    { category: `Your ${viewMode === 'monthly' ? 'Monthly' : 'Yearly'}`, value: parseFloat(displayResults.total.toFixed(2)) },
    { category: 'Global Average', value: globalAvg },
    { category: '2030 Target', value: targetVal },
  ];

  // Recommendations based on highest emissions
  const getRecommendations = () => {
    const categories = [
      { name: 'Transportation', value: results.transportation },
      { name: 'Home Energy', value: results.homeEnergy },
      { name: 'Food', value: results.food },
      { name: 'Shopping', value: results.shopping },
      { name: 'Waste', value: results.waste },
    ];

    const sorted = categories.sort((a, b) => b.value - a.value);
    const tips = {
      Transportation: [
        'Use public transport or carpool when possible',
        'Consider an electric or hybrid vehicle',
        'Walk or bike for short distances',
        'Combine errands to reduce trips',
      ],
      'Home Energy': [
        'Switch to LED bulbs',
        'Use energy-efficient appliances',
        'Improve home insulation',
        'Consider solar panels',
        'Unplug devices when not in use',
      ],
      Food: [
        'Reduce meat consumption',
        'Buy local and seasonal produce',
        'Minimize food waste',
        'Start a home garden',
      ],
      Shopping: [
        'Buy second-hand when possible',
        'Choose quality over quantity',
        'Avoid fast fashion',
        'Support sustainable brands',
      ],
      Waste: [
        'Start recycling and composting',
        'Use reusable bags and bottles',
        'Avoid single-use plastics',
        'Repair instead of replace',
      ],
    };

    return sorted.slice(0, 3).map(cat => ({
      category: cat.name,
      tips: tips[cat.name] || [],
    }));
  };

  const recommendations = getRecommendations();

  // PDF Download Function
  const downloadPDF = () => {
    const content = `
ECOTRACK - CARBON FOOTPRINT REPORT
${'='.repeat(50)}

Generated: ${new Date().toLocaleString()}

YOUR CARBON FOOTPRINT SUMMARY
--------------------------------
Monthly Emissions: ${results.total.toFixed(2)} kg CO₂
Daily Average: ${results.perDay.toFixed(2)} kg CO₂
Yearly Projection: ${(results.perYear / 1000).toFixed(2)} tons CO₂

BREAKDOWN BY CATEGORY
---------------------
Transportation: ${results.transportation.toFixed(2)} kg CO₂ (${((results.transportation/results.total)*100).toFixed(1)}%)
Home Energy: ${results.homeEnergy.toFixed(2)} kg CO₂ (${((results.homeEnergy/results.total)*100).toFixed(1)}%)
Food & Diet: ${results.food.toFixed(2)} kg CO₂ (${((results.food/results.total)*100).toFixed(1)}%)
Shopping: ${results.shopping.toFixed(2)} kg CO₂ (${((results.shopping/results.total)*100).toFixed(1)}%)
Waste: ${results.waste.toFixed(2)} kg CO₂ (${((results.waste/results.total)*100).toFixed(1)}%)

CARBON OFFSET
-------------
Trees needed to offset: ${treesNeeded} trees
(Each tree absorbs ~21kg CO₂ per year)

YOUR ACHIEVEMENT
----------------
Badge: ${achievement.title} ${achievement.icon}

FUN COMPARISONS
---------------
Your yearly footprint equals:
- ${comparisons.phoneCharges.toLocaleString()} phone charges
- ${comparisons.mumbaiDelhiFlights} Mumbai-Delhi flights
- ${comparisons.beefMeals} beef meals

RECOMMENDATIONS
---------------
${recommendations.map((rec, i) => `
${i + 1}. ${rec.category}:
${rec.tips.map(tip => `   - ${tip}`).join('\n')}
`).join('\n')}

${'='.repeat(50)}
Report generated by EcoTrack Carbon Footprint Calculator
Visit: https://ecotrack.com
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EcoTrack_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Share Results Function
  const shareResults = async () => {
    const shareText = `🌍 My Carbon Footprint on EcoTrack:\n\n` +
      `📊 Monthly: ${results.total.toFixed(2)} kg CO₂\n` +
      `📈 Yearly: ${(results.perYear / 1000).toFixed(2)} tons CO₂\n` +
      `🏆 Achievement: ${achievement.title} ${achievement.icon}\n\n` +
      `Calculate yours at EcoTrack!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Carbon Footprint',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard! Share it anywhere.');
    }
  };

  return (
    <div className="space-y-8">
      {/* View Mode Toggle & Download */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === 'yearly'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Yearly View
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={shareResults}
            className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Download className="w-5 h-5" />
            <span>Download Report</span>
            
          </button>
                    <div className="flex items-center space-x-2">
            <SocialShare calculation={calculation} />
            
            <button
              onClick={shareResults}
              className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            
            <button
              onClick={downloadPDF}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 text-center">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <Award className="w-12 h-12" />
          <span className="text-6xl">{achievement.icon}</span>
          <Award className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Achievement Unlocked!</h2>
        <p className="text-2xl font-semibold">{achievement.title}</p>
      </div>

      {/* Main Stats with Animated Counters */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
          title={`${viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Footprint`}
          value={viewMode === 'monthly' ? displayResults.total : displayResults.total / 1000}
          suffix={viewMode === 'monthly' ? ' kg' : ' tons'}
          subtitle="CO₂ emissions"
        />
        <StatCard
          icon={<Target className="w-8 h-8 text-green-500" />}
          title="Daily Average"
          value={displayResults.perDay}
          suffix=" kg"
          subtitle="CO₂ per day"
        />
        <StatCard
          icon={<TrendingDown className="w-8 h-8 text-purple-500" />}
          title={viewMode === 'monthly' ? 'Yearly Projection' : 'Monthly Average'}
          value={viewMode === 'monthly' ? results.perYear / 1000 : results.total}
          suffix={viewMode === 'monthly' ? ' tons' : ' kg'}
          subtitle={`CO₂ per ${viewMode === 'monthly' ? 'year' : 'month'}`}
        />
      </div>

      {/* Tree Offset Calculator */}
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Trees className="w-16 h-16" />
            <div>
              <h3 className="text-2xl font-bold mb-1">Plant Trees to Offset</h3>
              <p className="text-lg opacity-90">
                You need to plant <span className="font-bold text-3xl">{treesNeeded}</span> trees 
                to offset your yearly carbon footprint!
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-sm">
            🌳 Each tree absorbs approximately 21kg of CO₂ per year. 
            By planting {treesNeeded} trees, you can become carbon neutral!
          </p>
        </div>
      </div>

      {/* Fun Comparisons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Carbon Footprint Equals:</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ComparisonCard 
            emoji="📱"
            value={comparisons.phoneCharges.toLocaleString()}
            label="Phone Charges"
          />
          <ComparisonCard 
            emoji="✈️"
            value={comparisons.mumbaiDelhiFlights}
            label="Mumbai-Delhi Flights"
          />
          <ComparisonCard 
            emoji="🥩"
            value={comparisons.beefMeals}
            label="Beef Meals"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Emissions Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="kg CO₂" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">
            {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} carbon footprint comparison (kg CO₂)
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Based on your carbon footprint, here are ways to reduce your impact:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-lg p-5 shadow-md">
              <h4 className="font-bold text-lg text-primary mb-3">{rec.category}</h4>
              <ul className="space-y-2">
                {rec.tips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Statement */}
      <div className="bg-blue-500 text-white rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Your Impact</h3>
        <p className="text-lg">
          {results.perYear < 4000 ? (
            <>🌟 Great job! Your carbon footprint is below the 2030 target!</>
          ) : results.perYear < 8100 ? (
            <>👍 You're doing better than the global average. Keep improving!</>
          ) : (
            <>📈 There's room for improvement. Small changes can make a big difference!</>
          )}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, suffix, subtitle }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div>{icon}</div>
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">
      <CountUp end={parseFloat(value)} decimals={2} duration={2} />
      {suffix}
    </p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const ComparisonCard = ({ emoji, value, label }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center border border-gray-200">
    <div className="text-4xl mb-2">{emoji}</div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default ResultDashboard;