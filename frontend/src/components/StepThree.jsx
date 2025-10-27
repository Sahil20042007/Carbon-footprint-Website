import React from 'react';
import { UtensilsCrossed, Milk, Leaf } from 'lucide-react';

const StepThree = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      food: {
        ...formData.food,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <UtensilsCrossed className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Food & Diet</h2>
        <p className="text-gray-600 mt-2">Your eating habits have a significant impact on carbon emissions</p>
      </div>

      {/* Meat Consumption */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Meat Consumption</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often do you eat meat?
          </label>
          <select
            name="meatFrequency"
            value={formData.food.meatFrequency}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="daily">Daily (Every meal)</option>
            <option value="weekly">Several times a week</option>
            <option value="monthly">Few times a month</option>
            <option value="rarely">Rarely</option>
            <option value="never">Never (Vegetarian/Vegan)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Beef and lamb have the highest carbon footprint
          </p>
        </div>
      </div>

      {/* Dairy Consumption */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Milk className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Dairy Products</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often do you consume dairy products?
          </label>
          <select
            name="dairyFrequency"
            value={formData.food.dairyFrequency}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Several times a week</option>
            <option value="monthly">Few times a month</option>
            <option value="rarely">Rarely</option>
            <option value="never">Never (Vegan)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Milk, cheese, yogurt, butter, etc.
          </p>
        </div>
      </div>

      {/* Food Choices */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Leaf className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Food Choices</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="localFood"
              checked={formData.food.localFood}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              I primarily buy local and seasonal food
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="organicFood"
              checked={formData.food.organicFood}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              I buy organic food when possible
            </span>
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Did you know?</strong> Producing 1kg of beef creates about 60kg of CO2, 
          while 1kg of vegetables creates only 2kg. Choosing plant-based meals even a few 
          times a week can significantly reduce your carbon footprint!
        </p>
      </div>
    </div>
  );
};

export default StepThree;