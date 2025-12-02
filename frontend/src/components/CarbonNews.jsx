import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, TrendingUp, Award, Leaf, RefreshCw } from 'lucide-react';
import axios from 'axios';

const CarbonNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
  setLoading(true);
  try {
    // Add timestamp to prevent caching
    const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/news?t=${Date.now()}`);
    if (response.data.success) {
      setNews(response.data.data);
      console.log('✅ Loaded', response.data.count, 'news articles');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    setNews(getFallbackNews());
  } finally {
    setLoading(false);
  }
};

  const getFallbackNews = () => [
    {
      id: '1',
      title: 'India Achieves 40% Renewable Energy Target Ahead of Schedule',
      description: 'India reaches its 2030 renewable energy goal 7 years early, with solar and wind power leading the charge.',
      publishedAt: new Date().toISOString(),
      category: 'Achievement',
      source: 'Energy News',
      url: '#'
    },
    {
      id: '2',
      title: 'Electric Vehicle Sales Cross 2 Million Mark in India',
      description: 'EV adoption accelerates as more affordable models hit the market and charging infrastructure expands.',
      publishedAt: new Date().toISOString(),
      category: 'Technology',
      source: 'Auto Today',
      url: '#'
    },
    {
      id: '3',
      title: 'Scientists Develop Carbon-Absorbing Concrete',
      description: 'New building material can absorb CO₂ from the atmosphere, potentially revolutionizing construction.',
      publishedAt: new Date().toISOString(),
      category: 'Innovation',
      source: 'Science Daily',
      url: '#'
    }
  ];

  const categories = ['All', ...new Set(news.map(article => article.category))];

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Achievement': return <Award className="w-5 h-5" />;
      case 'Technology': return <TrendingUp className="w-5 h-5" />;
      case 'Innovation': return <Leaf className="w-5 h-5" />;
      default: return <Newspaper className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Achievement': return 'bg-green-100 text-green-700';
      case 'Technology': return 'bg-blue-100 text-blue-700';
      case 'Innovation': return 'bg-purple-100 text-purple-700';
      case 'Environment': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Climate News</h2>
        </div>
        <div className="flex items-center space-x-3">
          {!loading && (
            <button
              onClick={fetchNews}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Refresh news"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        </div>
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

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        /* News Feed */
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredNews.slice(0, 6).map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary transition cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                {/* Category Icon */}
                <div className={`${getCategoryColor(article.category)} p-3 rounded-lg flex-shrink-0`}>
                  {getCategoryIcon(article.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition pr-2">
                      {article.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-primary transition" />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredNews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No news found in this category</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          📰 Stay informed about the latest climate action and sustainability news
        </p>
      </div>
    </div>
  );
};

export default CarbonNews;