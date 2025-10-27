import React from 'react';
import { Car, Train, Plane } from 'lucide-react';

const StepOne = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      transportation: {
        ...formData.transportation,
        [name]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Car className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Transportation</h2>
        <p className="text-gray-600 mt-2">Tell us about your daily commute and travel habits</p>
      </div>

      {/* Car Usage */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Car</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Type
            </label>
            <select
              name="carType"
              value={formData.transportation.carType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance driven per month (km)
            </label>
            <input
              type="number"
              name="carKm"
              value={formData.transportation.carKm}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g., 500"
            />
          </div>
        </div>
      </div>

      {/* Public Transport */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Train className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Public Transport</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance traveled per month (km)
          </label>
          <input
            type="number"
            name="publicTransportKm"
            value={formData.transportation.publicTransportKm}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 200"
          />
          <p className="text-xs text-gray-500 mt-1">Bus, train, metro, etc.</p>
        </div>
      </div>

      {/* Air Travel */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Plane className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Air Travel</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short-haul flights per year
            </label>
            <input
              type="number"
              name="flightShortHaul"
              value={formData.transportation.flightShortHaul}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g., 2"
            />
            <p className="text-xs text-gray-500 mt-1">Under 1500 km</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long-haul flights per year
            </label>
            <input
              type="number"
              name="flightLongHaul"
              value={formData.transportation.flightLongHaul}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g., 1"
            />
            <p className="text-xs text-gray-500 mt-1">Over 1500 km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;