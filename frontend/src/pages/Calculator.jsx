import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculationAPI } from '../utils/api';
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import StepThree from '../components/StepThree';
import StepFour from '../components/StepFour';
import StepFive from '../components/StepFive';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Calculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transportation: {
      carKm: 0,
      carType: 'petrol',
      publicTransportKm: 0,
      flightShortHaul: 0,
      flightLongHaul: 0,
      bikeKm: 0,
    },
    homeEnergy: {
      electricityKwh: 0,
      naturalGasKwh: 0,
      heatingOil: 0,
      renewableEnergy: false,
    },
    food: {
      meatFrequency: 'weekly',
      dairyFrequency: 'daily',
      localFood: false,
      organicFood: false,
    },
    shopping: {
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      onlineOrdersPerMonth: 0,
      secondHand: false,
    },
    waste: {
      recycling: false,
      composting: false,
      plasticUsage: 'medium',
    },
  });

  const totalSteps = 5;
  const steps = [
    { number: 1, title: 'Transportation', component: StepOne },
    { number: 2, title: 'Home Energy', component: StepTwo },
    { number: 3, title: 'Food & Diet', component: StepThree },
    { number: 4, title: 'Shopping', component: StepFour },
    { number: 5, title: 'Waste', component: StepFive },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
  setLoading(true);
  setError('');

  console.log('🚀 Starting calculation...');
  console.log('📊 Form Data:', JSON.stringify(formData, null, 2));

  try {
    const response = await calculationAPI.create(formData);
    
    console.log('✅ API Response:', response);
    console.log('📈 Response Data:', response.data);
    
    if (response.data.success) {
      console.log('🎉 Success! Navigating to dashboard...');
      navigate('/dashboard', { 
        state: { newCalculation: response.data.data } 
      });
    }
  } catch (err) {
    console.error('❌ Full Error Object:', err);
    console.error('❌ Error Response:', err.response);
    console.error('❌ Error Data:', err.response?.data);
    console.error('❌ Error Status:', err.response?.status);
    
    setError(err.response?.data?.message || 'Failed to calculate. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition ${
                      currentStep > step.number
                        ? 'bg-primary text-white'
                        : currentStep === step.number
                        ? 'bg-primary text-white ring-4 ring-primary ring-opacity-30'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 hidden md:block">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Step Counter */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <CurrentStepComponent formData={formData} setFormData={setFormData} />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Calculate Footprint</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;