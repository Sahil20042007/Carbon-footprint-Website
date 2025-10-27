import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingDown, BarChart3, Lightbulb } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your <span className="text-primary">Carbon Footprint</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Measure, understand, and reduce your environmental impact with our comprehensive carbon footprint calculator.
            Start your journey towards a sustainable future today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-secondary transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-lg hover:bg-gray-50 transition shadow-lg border-2 border-primary"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Calculator className="w-12 h-12 text-primary" />}
            title="Easy Calculation"
            description="Simple multi-step wizard to calculate your carbon footprint across all life areas"
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-primary" />}
            title="Visual Analytics"
            description="Beautiful charts and graphs to visualize your environmental impact"
          />
          <FeatureCard
            icon={<TrendingDown className="w-12 h-12 text-primary" />}
            title="Track Progress"
            description="Monitor your carbon reduction journey over time with historical data"
          />
          <FeatureCard
            icon={<Lightbulb className="w-12 h-12 text-primary" />}
            title="Smart Tips"
            description="Get personalized recommendations to reduce your carbon footprint"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="8.1" label="Avg. Global Carbon Footprint (tons/year)" />
            <StatCard number="4.0" label="Target for 2030 (tons/year)" />
            <StatCard number="2.0" label="Sustainable Goal (tons/year)" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-primary rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users tracking and reducing their carbon footprint
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-primary text-lg font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
          >
            Start Calculating Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div>
    <div className="text-4xl font-bold text-primary mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default Landing;