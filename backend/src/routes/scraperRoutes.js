const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: 'Please provide a query parameter' });
  }

  try {
    // 1. Setup Axios with a real user agent so Google doesn't block us immediately
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}+travel+guide`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
      }
    });

    // 2. Load the HTML into Cheerio
    const $ = cheerio.load(response.data);
    const results = [];

    // 3. Extract basic search results (titles and snippets)
    $('.tF2Cxc').each((i, el) => {
      if (i < 5) { // Get top 5 results
        const title = $(el).find('h3').text();
        const link = $(el).find('a').attr('href');
        const snippet = $(el).find('.VwiC3b').text();
        
        if (title && link) {
          results.push({ title, link, snippet });
        }
      }
    });

    res.json({
      query,
      results,
      note: "Data scraped directly using Node.js!"
    });
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ message: 'Failed to scrape data.' });
  }
});

module.exports = router;
