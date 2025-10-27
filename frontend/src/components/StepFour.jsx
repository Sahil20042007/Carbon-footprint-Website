import React from 'react';
import { ShoppingBag, Shirt, Smartphone, Package } from 'lucide-react';

const StepFour = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      shopping: {
        ...formData.shopping,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <ShoppingBag className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Shopping & Consumption</h2>
        <p className="text-gray-600 mt-2">Manufacturing and shipping products contribute to emissions</p>
      </div>

      {/* Clothing */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Shirt className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Clothing</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New clothing items purchased per month
          </label>
          <input
            type="number"
            name="clothingItemsPerMonth"
            value={formData.shopping.clothingItemsPerMonth}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Shirts, pants, shoes, accessories, etc.
          </p>
        </div>
      </div>

      {/* Electronics */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Smartphone className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Electronics</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New electronics purchased per year
          </label>
          <input
            type="number"
            name="electronicsPerYear"
            value={formData.shopping.electronicsPerYear}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Phones, laptops, tablets, TVs, appliances, etc.
          </p>
        </div>
      </div>

      {/* Online Shopping */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Package className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">Online Orders</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Online orders/deliveries per month
          </label>
          <input
            type="number"
            name="onlineOrdersPerMonth"
            value={formData.shopping.onlineOrdersPerMonth}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="e.g., 5"
          />
          <p className="text-xs text-gray-500 mt-1">
            Each delivery includes packaging and transportation emissions
          </p>
        </div>
      </div>

      {/* Sustainable Choices */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Sustainable Shopping</h3>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="secondHand"
            checked={formData.shopping.secondHand}
            onChange={handleChange}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700">
            I frequently buy second-hand or refurbished items
          </span>
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <strong>Tip:</strong> The fashion industry accounts for 10% of global carbon emissions. 
          Buying second-hand, choosing quality over quantity, and repairing items instead of 
          replacing them can make a big difference!
        </p>
      </div>
    </div>
  );
};

export default StepFour;