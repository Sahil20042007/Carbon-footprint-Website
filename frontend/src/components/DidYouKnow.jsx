import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

const factsByCategory = {
  shocking: [
    "🌍 If everyone in the world lived like the average American, we would need 5 Earths to sustain us!",
    "🥩 Producing 1kg of beef creates 60kg of greenhouse gases - that's equivalent to driving 160 km!",
    "👕 The fashion industry produces 10% of global carbon emissions - more than all international flights combined!",
    "🍔 If cattle were a country, they would be the third-largest greenhouse gas emitter in the world.",
    "💧 It takes 15,000 liters of water to produce just 1 kg of beef!",
  ],
  positive: [
    "🌳 A single tree can absorb up to 21 kg of CO₂ per year. That's why forests are called the lungs of Earth!",
    "♻️ Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    "💡 LED bulbs use 75% less energy than traditional incandescent bulbs.",
    "🌱 Going vegan for just one day a week can save 100kg of CO₂ emissions per year.",
    "🚆 Trains are 12 times more efficient than planes and 7 times more than cars for the same journey.",
  ],
  technology: [
    "🚗 Switching to an electric vehicle can reduce your carbon footprint by 50% compared to a petrol car.",
    "🔋 Charging your phone uses only about 0.008 kg of CO₂ per charge - much less than you think!",
    "☀️ Solar panels can pay for themselves in 5-7 years and continue producing clean energy for 25+ years!",
    "💨 Wind turbines can power an average home for two days with just one rotation of their blades!",
  ],
  global: [
    "✈️ One round-trip flight from Mumbai to London produces about 1.6 tons of CO₂ per passenger.",
    "🏠 Buildings account for 40% of global energy consumption and 30% of carbon emissions.",
    "🌊 The ocean absorbs about 25% of all human-made CO₂ emissions, making it a crucial climate regulator.",
    "🌡️ The last decade (2010-2020) was the warmest on record globally.",
  ],
  daily: [
    "🚿 A 10-minute shower uses about 200 liters of water - reducing it by 2 minutes saves 40 liters!",
    "🍽️ Food waste accounts for 8% of global greenhouse gas emissions.",
    "📦 Reusing a shopping bag just 11 times has a lower environmental impact than using disposable bags.",
    "🏡 Proper home insulation can reduce heating energy consumption by up to 40%!",
  ]
};

const DidYouKnow = () => {
  const [currentFact, setCurrentFact] = useState({ text: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Facts', emoji: '🌍' },
    { id: 'shocking', label: 'Shocking', emoji: '😮' },
    { id: 'positive', label: 'Positive', emoji: '✨' },
    { id: 'technology', label: 'Tech', emoji: '🔬' },
    { id: 'global', label: 'Global', emoji: '🌏' },
    { id: 'daily', label: 'Daily Tips', emoji: '💡' },
  ];

  const getRandomFact = (category = 'all') => {
    let factsPool = [];
    
    if (category === 'all') {
      Object.values(factsByCategory).forEach(facts => {
        factsPool = [...factsPool, ...facts];
      });
    } else {
      factsPool = factsByCategory[category];
    }

    const randomIndex = Math.floor(Math.random() * factsPool.length);
    return factsPool[randomIndex];
  };

  useEffect(() => {
    setCurrentFact({ 
      text: getRandomFact(selectedCategory), 
      category: selectedCategory 
    });
  }, [selectedCategory]);

  const getNewFact = () => {
    let newFact;
    do {
      newFact = getRandomFact(selectedCategory);
    } while (newFact === currentFact.text);
    
    setCurrentFact({ text: newFact, category: selectedCategory });
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 animate-pulse" />
            <h3 className="text-xl font-bold">Did You Know?</h3>
          </div>
          <button
            onClick={getNewFact}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
            title="Show another fact"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-white text-blue-600'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fact Content */}
      <div className="bg-white bg-opacity-10 p-6">
        <p className="text-lg leading-relaxed">{currentFact.text}</p>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-black bg-opacity-20 text-center">
        <p className="text-xs opacity-75">
          Click categories to explore different topics • Click refresh for new facts
        </p>
      </div>
    </div>
  );
};

export default DidYouKnow;