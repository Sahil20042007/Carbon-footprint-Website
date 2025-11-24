import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingDown, BarChart3, Lightbulb, Globe, Users, Award, Zap, ArrowRight, PlayCircle } from 'lucide-react';

const LandingEnhanced = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
            style={{ top: '10%', left: '10%', transform: `translateY(${scrollY * 0.5}px)` }}
          ></div>
          <div 
            className="absolute w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
            style={{ top: '60%', right: '10%', transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
            style={{ bottom: '10%', left: '50%', transform: `translateY(${scrollY * 0.4}px)` }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-green-500 bg-opacity-20 rounded-full text-green-700 font-semibold text-sm backdrop-blur-sm border border-green-300">
              🌍 For a Sustainable Future
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
              Track Your
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Carbon Footprint
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Join the movement towards a <span className="font-bold text-green-600">carbon-neutral future</span>. 
            Measure, understand, and reduce your environmental impact with our intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-600">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg font-bold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/demo"
              className="group px-8 py-4 bg-white text-gray-800 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 border-2 border-gray-200"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up animation-delay-800">
            <StatCard number="10K+" label="Active Users" icon="👥" />
            <StatCard number="50K+" label="Calculations" icon="📊" />
            <StatCard number="2.5M kg" label="CO₂ Tracked" icon="🌱" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-green-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-green-500 rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 relative" id="features" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">Everything you need to manage your carbon footprint</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCardEnhanced
              icon={<Calculator className="w-12 h-12" />}
              title="Smart Calculator"
              description="AI-powered multi-step calculator with real-time calculations"
              color="from-blue-500 to-cyan-500"
              delay="0"
            />
            <FeatureCardEnhanced
              icon={<BarChart3 className="w-12 h-12" />}
              title="Visual Analytics"
              description="Beautiful charts and insights with exportable reports"
              color="from-purple-500 to-pink-500"
              delay="100"
            />
            <FeatureCardEnhanced
              icon={<TrendingDown className="w-12 h-12" />}
              title="Track Progress"
              description="Monitor your reduction journey with historical data"
              color="from-green-500 to-teal-500"
              delay="200"
            />
            <FeatureCardEnhanced
              icon={<Lightbulb className="w-12 h-12" />}
              title="Smart Tips"
              description="Personalized AI recommendations for carbon reduction"
              color="from-orange-500 to-red-500"
              delay="300"
            />
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">Make a Real Impact</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who are actively reducing their carbon footprint 
                and contributing to a sustainable future.
              </p>
              <div className="space-y-4">
                <ImpactStat icon="🌍" text="Equivalent to planting 119,047 trees" />
                <ImpactStat icon="🚗" text="Same as removing 543 cars from roads" />
                <ImpactStat icon="⚡" text="Powering 357 homes for a year" />
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <Globe className="w-full h-64 text-white opacity-80 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Section */}
      <div className="py-20 px-4" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Make It Fun & Engaging
            </h2>
            <p className="text-xl text-gray-600">Gamification features that keep you motivated</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GamificationCard
              icon="🔥"
              title="Daily Streaks"
              description="Build habits with consecutive day tracking"
              gradient="from-orange-400 to-red-500"
            />
            <GamificationCard
              icon="🏆"
              title="Leaderboards"
              description="Compete with others and climb the ranks"
              gradient="from-yellow-400 to-orange-500"
            />
            <GamificationCard
              icon="🎯"
              title="Carbon Goals"
              description="Set and achieve reduction targets"
              gradient="from-green-400 to-teal-500"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-20 h-20 mx-auto mb-6 animate-bounce" />
          <h2 className="text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-2xl mb-8 opacity-90">
            Join our community and start your journey towards carbon neutrality today
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-5 bg-white text-purple-600 text-xl font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            Start Your Free Journey
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(12px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        .bg-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ number, label, icon }) => (
  <div className="text-center p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-xl border border-white">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{number}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

const FeatureCardEnhanced = ({ icon, title, description, color, delay }) => (
  <div 
    className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`inline-block p-4 bg-gradient-to-br ${color} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform rounded-b-2xl`}></div>
  </div>
);

const ImpactStat = ({ icon, text }) => (
  <div className="flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
    <span className="text-3xl">{icon}</span>
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

const GamificationCard = ({ icon, title, description, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${gradient} text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2`}>
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-white text-opacity-90">{description}</p>
    <div className="absolute -bottom-4 -right-4 text-8xl opacity-10">{icon}</div>
  </div>
);

export default LandingEnhanced;