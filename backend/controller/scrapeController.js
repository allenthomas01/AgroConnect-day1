const scrapeService = require('../services/scrapeServices');
let response;

//status fetching successfull
exports.fetch = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { data } = req.body;
        response = await scrapeService.getData(data);
        console.log(response);
        res.json({ status: true, success: 'Scraping data fetched from site successfully',fetched_data:response });
    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

//status viewing successfull
exports.display = async (req, res, next) => {
    try {
        response = await scrapeService.getSavedData();
        res.json({ success: true, response });
      } catch (err) {
        console.error('Error fetching scraped data from database:', err);
        next(err);
}
}