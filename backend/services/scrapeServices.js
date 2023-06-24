const axios = require('axios');
const cheerio = require('cheerio');
const scrapeModel = require('../model/scrapeModel');
let errorMessage;
let response;

class scrapeService {
  static async getData() {
    try {
      const url = 'https://keralaagriculture.gov.in/en/10951-2/';
       response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const englishTextArray = [];

      $('marquee a').each((index, element) => {
        const text = $(element).text();
        englishTextArray.push(text);
      });

      // Delete the previous document
      await scrapeModel.deleteMany({});

      // Create and save the new document with the fetched data
      const createNotification = new scrapeModel({ data: englishTextArray });
      return await createNotification.save();
    } catch (err) {
      errorMessage = `\n\nError: Saving scraped data to database failed.\n\n`;
      console.log(errorMessage);
      //res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }
  }

  static async getSavedData() {
    try {
      const savedData = await scrapeModel.findOne().sort({ _id: -1 }).exec();
      if (!savedData) {
        errorMessage = `\n\nError: No data found\n\n`;
        console.log(errorMessage);
      }
      return savedData.data;
    } catch (err) {
      errorMessage = `\n\nError: Fetching scraped data from database failed.\n\n`;
      console.log(errorMessage);
      //res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }
  }
}

/* function isEnglishText(text) {
  // Assuming that English text contains only alphanumeric characters and common punctuation
  const regex = /^[a-zA-Z0-9\s.,!?'"()]+$/;
  return regex.test(text);
} */

module.exports = scrapeService;
