import React from 'react';
import { Trash2, Recycle, Leaf } from 'lucide-react';

const StepFive = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      waste: {
        ...formData.waste,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Trash2 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Waste Management</h2>
        <p className="text-gray-600 mt-2">How you handle waste impacts your carbon footprint</p>
      </div>

      {/* Recycling */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Recycle className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Recycling & Composting</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="recycling"
              checked={formData.waste.recycling}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              I regularly recycle paper, plastic, glass, and metal
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="composting"
              checked={formData.waste.composting}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              I compost organic waste (food scraps, yard waste)
            </span>
          </label>
        </div>
      </div>

      {/* Plastic Usage */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Leaf className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Plastic Consumption</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate your single-use plastic consumption?
          </label>
          <select
            name="plasticUsage"
            value={formData.waste.plasticUsage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="high">High (Multiple plastic items daily)</option>
            <option value="medium">Medium (Some plastic items daily)</option>
            <option value="low">Low (Rarely use single-use plastics)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Plastic bags, bottles, packaging, disposable items, etc.
          </p>
        </div>
      </div>

      {/* Waste Reduction Tips */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Waste Habits</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Use reusable bags, bottles, and containers
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Avoid products with excessive packaging
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Donate or sell items instead of throwing them away
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Repair items instead of replacing them
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-800">
          <strong>Remember:</strong> The waste hierarchy is Reduce, Reuse, Recycle - in that order! 
          Reducing consumption and reusing items has a bigger impact than recycling. Every piece of 
          waste that doesn't end up in a landfill helps reduce methane emissions.
        </p>
      </div>
    </div>
  );
};

export default StepFive;