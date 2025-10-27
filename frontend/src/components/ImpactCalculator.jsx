import React, { useState } from 'react';
import { Globe, Users, TreePine, Zap, Droplets } from 'lucide-react';

const ImpactCalculator = ({ userFootprint }) => {
  const [multiplier, setMultiplier] = useState(1000);

  // Calculate global impact if X people followed user's footprint
  const calculateImpact = () => {
    const totalYearly = (userFootprint * 12 * multiplier) / 1000; // in tons
    const globalAvg = 8.1; // tons per person per year
    const globalTotal = globalAvg * multiplier;
    const savings = globalTotal - totalYearly;

    // Convert savings to tangible metrics
    const treesEquivalent = Math.floor(savings * 1000 / 21); // 1 tree = 21kg/year
    const carsOffRoad = Math.floor(savings / 4.6); // avg car = 4.6 tons/year
    const homesEnergy = Math.floor(savings / 7.5); // avg home = 7.5 tons/year
    const gallonsGas = Math.floor(savings * 113); // 1 ton CO2 = 113 gallons
    
    return {
      totalYearly,
      globalTotal,
      savings: Math.max(0, savings),
      treesEquivalent,
      carsOffRoad,
      homesEnergy,
      gallonsGas,
      percentageReduction: ((savings / globalTotal) * 100).toFixed(1)
    };
  };

  const impact = calculateImpact();

  const multiplierOptions = [
    { value: 100, label: '100 people' },
    { value: 1000, label: '1,000 people' },
    { value: 10000, label: '10,000 people' },
    { value: 100000, label: '100,000 people' },
    { value: 1000000, label: '1 Million people' },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
        <h2 className="text-2xl font-bold">Global Impact Calculator</h2>
      </div>

      <p className="mb-6 text-lg opacity-90">
        What if <strong>{multiplier.toLocaleString()} people</strong> had your carbon footprint?
      </p>

      {/* Multiplier Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {multiplierOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setMultiplier(option.value)}
            className={`px-3 py-2 rounded-lg font-semibold transition text-sm ${
              multiplier === option.value
                ? 'bg-white text-blue-600'
                : 'bg-white bg-opacity-20 hover:bg-opacity-30'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Impact Stats */}
      {impact.savings > 0 ? (
        <div className="space-y-4">
          {/* Main Stat */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
            <p className="text-sm opacity-90 mb-2">Total CO₂ Saved Per Year</p>
            <p className="text-5xl font-bold mb-2">
              {impact.savings.toLocaleString()}
            </p>
            <p className="text-xl">tons of CO₂</p>
            <p className="text-sm opacity-90 mt-2">
              That's a <strong>{impact.percentageReduction}%</strong> reduction!
            </p>
          </div>

          {/* Equivalents */}
          <div className="grid md:grid-cols-2 gap-4">
            <ImpactCard
              icon={<TreePine className="w-8 h-8" />}
              value={impact.treesEquivalent.toLocaleString()}
              label="Trees Planted"
              description="Same CO₂ absorption"
            />
            <ImpactCard
              icon={<Users className="w-8 h-8" />}
              value={impact.carsOffRoad.toLocaleString()}
              label="Cars Off Road"
              description="For one year"
            />
            <ImpactCard
              icon={<Zap className="w-8 h-8" />}
              value={impact.homesEnergy.toLocaleString()}
              label="Homes' Energy"
              description="Annual usage"
            />
            <ImpactCard
              icon={<Droplets className="w-8 h-8" />}
              value={impact.gallonsGas.toLocaleString()}
              label="Gallons of Gas"
              description="Not burned"
            />
          </div>

          {/* Call to Action */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <p className="text-sm">
              🌍 <strong>Every action counts!</strong> Share your carbon reduction journey 
              and inspire others to make a difference.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
          <p className="text-lg mb-2">You're doing great! 🎉</p>
          <p className="text-sm opacity-90">
            Your footprint is already below the global average. 
            If {multiplier.toLocaleString()} people matched your lifestyle, 
            we'd still save <strong>{Math.abs(impact.savings).toFixed(1)} tons</strong> of CO₂!
          </p>
        </div>
      )}
    </div>
  );
};

const ImpactCard = ({ icon, value, label, description }) => (
  <div className="bg-white bg-opacity-10 rounded-lg p-4">
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <div className="flex-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </div>
    <p className="text-xs opacity-75">{description}</p>
  </div>
);

export default ImpactCalculator;