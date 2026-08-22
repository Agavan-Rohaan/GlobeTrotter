const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./src/models/Place');

async function testScraper(query) {
  console.log(`Starting scrape for: ${query}`);
  try {
    // 1. Get the sections of the page
    const sectionsUrl = `https://en.wikivoyage.org/w/api.php?action=parse&page=${encodeURIComponent(query)}&prop=sections&format=json`;
    const sectionsResponse = await axios.get(sectionsUrl, {
      headers: { 'User-Agent': 'GlobeTrotterTravelApp/1.0' }
    });

    const sections = sectionsResponse.data?.parse?.sections || [];
    const seeSection = sections.find(s => s.line === 'See' || s.line === 'Landmarks');
    
    if (!seeSection) {
      console.log('No "See" section found on Wikivoyage for this query.');
      return;
    }

    // 2. Get the HTML content of the "See" section
    const contentUrl = `https://en.wikivoyage.org/w/api.php?action=parse&page=${encodeURIComponent(query)}&section=${seeSection.index}&prop=text&format=json`;
    const contentResponse = await axios.get(contentUrl, {
      headers: { 'User-Agent': 'GlobeTrotterTravelApp/1.0' }
    });

    const html = contentResponse.data?.parse?.text?.['*'];
    if (!html) return;

    // 3. Parse the HTML using Cheerio to extract the listings (vcard)
    const $ = cheerio.load(html);
    const results = [];
    const dummyTripId = new mongoose.Types.ObjectId();

    $('.vcard').each((i, el) => {
      if (i < 10) {
        const name = $(el).find('.listing-name').text().trim() || $(el).find('b').first().text().trim();
        const description = $(el).find('.listing-content').text().trim() || $(el).text().replace(name, '').trim().substring(0, 150) + '...';
        
        if (name) {
          results.push({
            trip_id: dummyTripId,
            name,
            notes: description,
            category: 'Sightseeing'
          });
        }
      }
    });

    console.log(`Extracted ${results.length} POIs. Attempting DB insertion...`);
    
    // Test DB Insertion
    await mongoose.connect(process.env.MONGO_URI);
    const savedPlaces = await Place.insertMany(results);
    console.log(`✅ Successfully saved ${savedPlaces.length} places into MongoDB!`);

    // Clean up
    await Place.deleteMany({ trip_id: dummyTripId });
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Scraping error:', error.message);
  }
}

testScraper('Paris');
