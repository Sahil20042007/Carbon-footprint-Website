import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';

const CarbonGoals = ({ currentFootprint }) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('carbonGoals');
    return saved ? JSON.parse(saved) : {
      monthly: 0,
      yearly: 0,
      reductionPercentage: 10,
    };
  });

  const [showGoalSetter, setShowGoalSetter] = useState(false);

  useEffect(() => {
    localStorage.setItem('carbonGoals', JSON.stringify(goals));
  }, [goals]);

  const suggestedReductions = [
    { percentage: 10, label: 'Beginner', color: 'bg-green-500' },
    { percentage: 20, label: 'Intermediate', color: 'bg-blue-500' },
    { percentage: 30, label: 'Advanced', color: 'bg-purple-500' },
    { percentage: 50, label: 'Expert', color: 'bg-red-500' },
  ];

  const setGoal = (percentage) => {
    const monthlyGoal = currentFootprint * (1 - percentage / 100);
    const yearlyGoal = monthlyGoal * 12;
    
    setGoals({
      monthly: monthlyGoal,
      yearly: yearlyGoal,
      reductionPercentage: percentage,
      startFootprint: currentFootprint,
      setDate: new Date().toISOString(),
    });
    
    setShowGoalSetter(false);
  };

  const calculateProgress = () => {
    if (!goals.startFootprint) return 0;
    const reduction = goals.startFootprint - currentFootprint;
    const targetReduction = goals.startFootprint * (goals.reductionPercentage / 100);
    return Math.min((reduction / targetReduction) * 100, 100);
  };

  const progress = calculateProgress();
  const isGoalAchieved = progress >= 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Carbon Reduction Goals</h2>
        </div>
        <button
          onClick={() => setShowGoalSetter(!showGoalSetter)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
        >
          {goals.reductionPercentage ? 'Update Goal' : 'Set Goal'}
        </button>
      </div>

      {showGoalSetter ? (
        <div className="space-y-4">
          <p className="text-gray-600">Choose your reduction target:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestedReductions.map((option) => (
              <button
                key={option.percentage}
                onClick={() => setGoal(option.percentage)}
                className={`${option.color} text-white p-6 rounded-lg hover:opacity-90 transition text-center`}
              >
                <div className="text-3xl font-bold mb-2">{option.percentage}%</div>
                <div className="text-sm font-semibold">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : goals.reductionPercentage ? (
        <div className="space-y-6">
          {/* Current Goal */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Your Goal</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Target Reduction</p>
                <p className="text-3xl font-bold">{goals.reductionPercentage}%</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Target Monthly Footprint</p>
                <p className="text-3xl font-bold">{goals.monthly.toFixed(0)} kg</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-primary">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalAchieved ? 'bg-green-500' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${
            isGoalAchieved ? 'bg-green-100' : 'bg-blue-50'
          }`}>
            {isGoalAchieved ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-green-800">Goal Achieved! 🎉</p>
                  <p className="text-sm text-green-700">
                    You've successfully reduced your carbon footprint by {goals.reductionPercentage}%!
                  </p>
                </div>
              </>
            ) : (
              <>
                <TrendingDown className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-bold text-blue-800">Keep Going!</p>
                  <p className="text-sm text-blue-700">
                    You need to reduce {((goals.startFootprint - goals.monthly) - (goals.startFootprint - currentFootprint)).toFixed(1)} kg more to reach your goal.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Milestones */}
          <div className="grid md:grid-cols-3 gap-4">
            <MilestoneCard
              achieved={progress >= 25}
              title="25% Complete"
              icon="🌱"
            />
            <MilestoneCard
              achieved={progress >= 50}
              title="Halfway There!"
              icon="🌿"
            />
            <MilestoneCard
              achieved={progress >= 100}
              title="Goal Achieved!"
              icon="🏆"
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Goal Set</h3>
          <p className="text-gray-600 mb-6">
            Set a carbon reduction goal to track your progress and stay motivated!
          </p>
          <button
            onClick={() => setShowGoalSetter(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
          >
            Set Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

const MilestoneCard = ({ achieved, title, icon }) => (
  <div className={`p-4 rounded-lg text-center border-2 ${
    achieved 
      ? 'bg-green-50 border-green-500' 
      : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="text-3xl mb-2">{icon}</div>
    <p className={`font-semibold ${achieved ? 'text-green-700' : 'text-gray-500'}`}>
      {title}
    </p>
    {achieved && (
      <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-2" />
    )}
  </div>
);

export default CarbonGoals;