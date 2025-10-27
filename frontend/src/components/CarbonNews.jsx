import React, { useState } from 'react';
import { Newspaper, ExternalLink, TrendingUp, Award, Leaf } from 'lucide-react';

const newsArticles = [
  {
    id: 1,
    title: "India Achieves 40% Renewable Energy Target Ahead of Schedule",
    summary: "India reaches its 2030 renewable energy goal 7 years early, with solar and wind power leading the charge.",
    date: "2025-10-20",
    category: "Achievement",
    icon: <Award className="w-5 h-5" />,
    color: "bg-green-500",
    link: "#"
  },
  {
    id: 2,
    title: "Electric Vehicle Sales in India Cross 2 Million Mark",
    summary: "EV adoption accelerates as more affordable models hit the market and charging infrastructure expands.",
    date: "2025-10-18",
    category: "Technology",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-blue-500",
    link: "#"
  },
  {
    id: 3,
    title: "Scientists Develop Carbon-Absorbing Concrete",
    summary: "New building material can absorb CO₂ from the atmosphere, potentially revolutionizing construction industry.",
    date: "2025-10-15",
    category: "Innovation",
    icon: <Leaf className="w-5 h-5" />,
    color: "bg-purple-500",
    link: "#"
  },
  {
    id: 4,
    title: "Global Carbon Emissions Drop 5% in 2025",
    summary: "Worldwide efforts show results as renewable energy adoption and conservation measures take effect.",
    date: "2025-10-12",
    category: "Achievement",
    icon: <Award className="w-5 h-5" />,
    color: "bg-green-500",
    link: "#"
  },
  {
    id: 5,
    title: "Mumbai Launches India's Largest Urban Forest Project",
    summary: "City plans to plant 5 million trees over next 3 years to improve air quality and reduce urban heat.",
    date: "2025-10-10",
    category: "Environment",
    icon: <Leaf className="w-5 h-5" />,
    color: "bg-emerald-500",
    link: "#"
  },
  {
    id: 6,
    title: "Breakthrough in Hydrogen Fuel Technology",
    summary: "New catalyst makes green hydrogen production 40% more efficient and cost-effective.",
    date: "2025-10-08",
    category: "Technology",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-blue-500",
    link: "#"
  },
];

const CarbonNews = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Achievement', 'Technology', 'Innovation', 'Environment'];

  const filteredNews = selectedCategory === 'All' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Climate News</h2>
        </div>
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              {/* Category Icon */}
              <div className={`${article.color} text-white p-3 rounded-lg flex-shrink-0`}>
                {article.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {article.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    article.category === 'Achievement' ? 'bg-green-100 text-green-700' :
                    article.category === 'Technology' ? 'bg-blue-100 text-blue-700' :
                    article.category === 'Innovation' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {article.category}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {formatDate(article.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Stay informed about the latest climate action and sustainability news
        </p>
      </div>
    </div>
  );
};

export default CarbonNews;