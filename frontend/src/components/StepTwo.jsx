import React from 'react';
import { Home, Zap, Flame } from 'lucide-react';

const StepTwo = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      homeEnergy: {
        ...formData.homeEnergy,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Home className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Home Energy</h2>
        <p className="text-gray-600 mt-2">Information about your household energy consumption</p>
      </div>

      {/* Electricity */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Electricity</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly electricity consumption (kWh)
          </label>
          <input
            type="number"
            name="electricityKwh"
            value={formData.homeEnergy.electricityKwh}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 300"
          />
          <p className="text-xs text-gray-500 mt-1">Check your electricity bill for this information</p>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="renewableEnergy"
              checked={formData.homeEnergy.renewableEnergy}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              I use renewable energy sources (solar, wind, etc.)
            </span>
          </label>
        </div>
      </div>

      {/* Natural Gas */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Flame className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Natural Gas</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly natural gas consumption (kWh)
          </label>
          <input
            type="number"
            name="naturalGasKwh"
            value={formData.homeEnergy.naturalGasKwh}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 150"
          />
          <p className="text-xs text-gray-500 mt-1">For cooking, heating, hot water</p>
        </div>
      </div>

      {/* Heating Oil */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Heating Oil</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly heating oil consumption (liters)
          </label>
          <input
            type="number"
            name="heatingOil"
            value={formData.homeEnergy.heatingOil}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 50"
          />
          <p className="text-xs text-gray-500 mt-1">Leave at 0 if not applicable</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Your energy bills contain most of this information. If you're unsure, 
          average household electricity usage is about 250-400 kWh per month.
        </p>
      </div>
    </div>
  );
};

export default StepTwo;