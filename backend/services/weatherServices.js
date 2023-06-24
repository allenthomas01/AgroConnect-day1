const axios = require('axios');
const weatherModel = require('../model/weatherModel');
require('dotenv').config();
let errorMessage;
let response;
class weatherService {
  static async saveWeatherData(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`;

    try {
      response = await axios.get(url);

      if (response && response.data) {
        const { data } = response;
        const { coord } = data;
        latitude = latitude.toFixed(4);
        longitude = longitude.toFixed(4);

        await weatherModel.deleteMany({
          'coord.lat': latitude,
          'coord.lon': longitude
        });

        const duplicateWeatherDocuments = await weatherModel.aggregate([
          {
            $group: {
              _id: "$sys.id",
              count: { $sum: 1 },
              duplicateIds: { $push: "$_id" }
            }
          },
          {
            $match: {
              count: { $gt: 1 }
            }
          }
        ]).exec();
    
        const duplicateIds = duplicateWeatherDocuments.flatMap(doc => doc.duplicateIds);
    
        await weatherModel.deleteMany({ _id: { $in: duplicateIds } });
        const weatherData = new weatherModel(data);
        await weatherData.save();

        // Extract the nested "sys" field properties
        const { type, id, country, sunrise, sunset } = weatherData.sys;

        // Create a new Weather object using the weather data
        const weather = new weatherModel({
          ...weatherData,
          sys: {
            type,
            id,
            country,
            sunrise,
            sunset,
          },
        });
        console.log('\n\nWeather data saved successfully\n\n');
        return await weather.save();
        
      } else {
        errorMessage = `\n\nError: Failed to retrive weather data\n\n`;
        console.log(errorMessage);
        //res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
      }
    } catch (error) {
      errorMessage = `\n\nError: Failed to save weather data. Missing latitude or longitude \n\n`;
      console.log(errorMessage);
      //res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }
  }

  static async getWeatherData(latitude, longitude) {
    try {
      latitude = latitude.toFixed(4);
      longitude = longitude.toFixed(4);
      const weatherData = weatherModel.findOne({ 'coord.lat': latitude, 'coord.lon': longitude});
      if (!weatherData) {
        errorMessage = `\n\nError: No weather data found for the given latitude and longitude\n\n`;
        console.log(errorMessage);
        //res.status(400).json({ error: errorMessage });
        return; // Stop further execution of the code
      }
      console.log('\n\nWeather data fetched successfully\n\n',weatherData);
      return weatherData;
    } catch (error) {
      errorMessage = `\n\nError: Failed to fetch weather data\n\n`;
      console.log(errorMessage);
      //res.status(400).json({ error: errorMessage });
      return; // Stop further execution of the code
    }
  }
}

module.exports = weatherService;
