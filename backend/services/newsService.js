const axios = require('axios');

// Fetch real climate news from NewsAPI
async function fetchClimateNews() {
  try {
    const API_KEY = 'your_newsapi_key'; // Get free from newsapi.org
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=climate+carbon+environment&sortBy=publishedAt&apiKey=${API_KEY}&pageSize=10`
    );
    return response.data.articles;
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
}

module.exports = { fetchClimateNews };