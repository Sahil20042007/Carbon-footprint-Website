const axios = require('axios');

async function fetchClimateNews() {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    
    console.log('🔑 API Key exists:', !!API_KEY);
    console.log('🔑 API Key length:', API_KEY ? API_KEY.length : 0);
    
    if (!API_KEY || API_KEY === 'your_news_api_key') {
      console.log('⚠️  News API key not configured properly');
      return getFallbackNews();
    }

    console.log('📡 Calling News API...');
    
    const response = await axios.get(
      `https://newsapi.org/v2/everything`,
      {
        params: {
          q: 'climate change OR carbon footprint OR sustainability',
          sortBy: 'publishedAt',
          language: 'en',
          apiKey: API_KEY,
          pageSize: 10
        },
        timeout: 10000
      }
    );

    console.log('✅ News API Response Status:', response.status);
    console.log('📰 Articles found:', response.data.articles?.length || 0);

    if (response.data.articles && response.data.articles.length > 0) {
      const articles = response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        description: article.description || 'No description available',
        publishedAt: article.publishedAt,
        category: categorizeArticle(article.title),
        source: article.source.name,
        url: article.url
      }));
      
      console.log('✅ Returning', articles.length, 'real articles');
      return articles;
    }

    console.log('⚠️  No articles in response, using fallback');
    return getFallbackNews();
    
  } catch (error) {
    console.error('❌ News API error:', error.message);
    console.error('❌ Error details:', error.response?.data || 'No details');
    return getFallbackNews();
  }
}

function categorizeArticle(title) {
  const lower = title.toLowerCase();
  
  if (lower.includes('technology') || lower.includes('innovation')) {
    return 'Technology';
  } else if (lower.includes('policy') || lower.includes('government')) {
    return 'Policy';
  } else if (lower.includes('renewable') || lower.includes('solar') || lower.includes('wind')) {
    return 'Innovation';
  } else if (lower.includes('record') || lower.includes('achievement')) {
    return 'Achievement';
  }
  
  return 'Environment';
}

function getFallbackNews() {
  console.log('📋 Using fallback news');
  return [
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
}

module.exports = { fetchClimateNews };