const { getWeatherByCity } = require('../services/weatherService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getWeather = asyncHandler(async (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) {
    throw new AppError('Please provide a city name', 400);
  }

  const weather = await getWeatherByCity(city);
  res.json({ success: true, weather });
});

module.exports = { getWeather };
