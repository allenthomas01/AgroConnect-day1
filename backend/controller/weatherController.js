const weatherService = require('../services/weatherServices');
let response;

// status: fetching weather successfull
exports.saveWeather = async (req, res, next) => {
  const { latitude, longitude} = req.body;


  try {
    response = await weatherService.saveWeatherData(latitude, longitude);
    if(response==undefined){
      res.status(500).json({ error: 'Failed to save weather data' });
    }
    res.status(200).json({ message: 'Weather data saved successfully' });   
  } catch (error) {
    console.error('\nError saving weather data \n');
    
    next(error);
  }
};


//status: displaying weather successfull
exports.getWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    response= await weatherService.getWeatherData(latitude, longitude);
    res.json({message:'Successfully fetched weather from database.',response});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
    next(error);
  }
};

//rmodule.exports = { saveWeather };
