const axios = require('axios');
const AppError = require('../utils/AppError');

const buildAdvisory = (weather) => {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const condition = (weather.weather[0]?.main || '').toLowerCase();
  const tips = [];

  if (temp > 35) {
    tips.push(
      'High temperatures can stress crops. Consider irrigation in early morning or evening and provide shade for sensitive seedlings where possible.'
    );
  } else if (temp < 10) {
    tips.push(
      'Cool conditions may slow crop growth. Protect tender plants from cold and avoid heavy watering during very cold hours.'
    );
  } else {
    tips.push(
      'Temperatures are in a moderate range for many field operations. Plan spraying and fieldwork when winds are calmer.'
    );
  }

  if (humidity > 80) {
    tips.push(
      'High humidity can increase fungal disease risk. Improve air circulation if growing under cover and monitor crops for leaf spots.'
    );
  } else if (humidity < 30) {
    tips.push(
      'Low humidity and dry air can increase water demand. Check soil moisture before irrigating.'
    );
  }

  if (wind > 8) {
    tips.push(
      'Strong winds make pesticide or fertilizer spraying less effective and risk drift. Prefer calmer periods for spraying.'
    );
  }

  if (condition.includes('rain') || condition.includes('drizzle')) {
    tips.push(
      'Wet conditions may delay fieldwork and increase disease pressure. Avoid unnecessary spraying during rain.'
    );
  }

  if (condition.includes('clear') || condition.includes('sun')) {
    tips.push(
      'Clear skies favour drying and many field activities. Protect workers and young plants from prolonged midday sun.'
    );
  }

  return {
    disclaimer:
      'This advisory is general weather-based guidance only. It is not a verified agronomic recommendation and does not guarantee crop protection or yield. Consult local agricultural officers for crop-specific advice.',
    tips,
  };
};

const getWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new AppError(
      'Weather service is not configured. Please set OPENWEATHER_API_KEY in the server .env file.',
      503
    );
  }

  try {
    const currentRes = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
        },
        timeout: 10000,
      }
    );

    const weather = currentRes.data;
    let forecast = null;

    try {
      const forecastRes = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric',
            cnt: 8,
          },
          timeout: 10000,
        }
      );
      forecast = (forecastRes.data.list || []).map((item) => ({
        time: item.dt_txt,
        temp: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        description: item.weather[0]?.description,
        icon: item.weather[0]?.icon,
        windSpeed: item.wind.speed,
      }));
    } catch {
      forecast = null;
    }

    return {
      city: weather.name,
      country: weather.sys.country,
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      condition: weather.weather[0]?.main,
      description: weather.weather[0]?.description,
      icon: weather.weather[0]?.icon,
      sunrise: weather.sys.sunrise
        ? new Date(weather.sys.sunrise * 1000).toISOString()
        : null,
      sunset: weather.sys.sunset
        ? new Date(weather.sys.sunset * 1000).toISOString()
        : null,
      forecast,
      advisory: buildAdvisory(weather),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error.response?.status === 404) {
      throw new AppError('City not found. Please check the city name.', 404);
    }
    if (error.response?.status === 401) {
      throw new AppError('Invalid OpenWeather API key', 502);
    }

    throw new AppError(
      'Unable to load weather data right now. Please try again later.',
      502
    );
  }
};

module.exports = { getWeatherByCity };
