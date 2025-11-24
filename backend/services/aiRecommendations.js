function generateAIRecommendations(calculation) {
  const { results, transportation, homeEnergy, food, shopping, waste } = calculation;
  
  const recommendations = [];
  
  // Advanced AI logic
  if (results.transportation > 30) {
    if (transportation.carType === 'petrol' || transportation.carType === 'diesel') {
      recommendations.push({
        priority: 'HIGH',
        category: 'Transportation',
        action: 'Switch to Electric Vehicle',
        impact: `Save ${(transportation.carKm * 0.139).toFixed(2)} kg CO₂/month`,
        cost: 'Medium',
        difficulty: 'Medium'
      });
    }
  }
  
  if (results.homeEnergy > 50 && !homeEnergy.renewableEnergy) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Energy',
      action: 'Install Solar Panels',
      impact: `Save ${(homeEnergy.electricityKwh * 0.527 * 0.7).toFixed(2)} kg CO₂/month`,
      cost: 'High',
      difficulty: 'High',
      paybackPeriod: '5-7 years'
    });
  }
  
  return recommendations.sort((a, b) => {
    const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return priority[b.priority] - priority[a.priority];
  });
}

module.exports = { generateAIRecommendations };