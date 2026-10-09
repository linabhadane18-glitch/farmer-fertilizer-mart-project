import { useState } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const Weather = () => {
  const [city, setCity] = useState('Pune');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e?.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/weather?city=${encodeURIComponent(city.trim())}`);
      setWeather(data.weather);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Weather Dashboard</h1>
          <p className="page-sub">
            Check current conditions for your city. General weather info is separate from
            verified agricultural advice.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '1.5rem 0 3rem', maxWidth: 900 }}>
        <form className="filters-bar" onSubmit={fetchWeather}>
          <input
            type="search"
            placeholder="Enter city name (e.g. Mumbai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <button type="submit" className="btn btn-primary">
            <Search size={16} /> Search
          </button>
        </form>

        {loading && <Loader message="Fetching weather..." />}
        {error && <div className="alert alert-error">{error}</div>}

        {weather && (
          <>
            <div className="weather-card">
              <div className="weather-main">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width={90}
                  height={90}
                />
                <div>
                  <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
                  <h2>
                    {weather.city}, {weather.country}
                  </h2>
                  <p style={{ textTransform: 'capitalize' }}>{weather.description}</p>
                </div>
              </div>

              <div className="weather-stats">
                <div className="weather-stat">
                  <strong>Feels like</strong>
                  <div>{Math.round(weather.feelsLike)}°C</div>
                </div>
                <div className="weather-stat">
                  <strong>Humidity</strong>
                  <div>{weather.humidity}%</div>
                </div>
                <div className="weather-stat">
                  <strong>Wind speed</strong>
                  <div>{weather.windSpeed} m/s</div>
                </div>
                <div className="weather-stat">
                  <strong>Condition</strong>
                  <div>{weather.condition}</div>
                </div>
                {weather.sunrise && (
                  <div className="weather-stat">
                    <strong>Sunrise</strong>
                    <div>{new Date(weather.sunrise).toLocaleTimeString('en-IN')}</div>
                  </div>
                )}
                {weather.sunset && (
                  <div className="weather-stat">
                    <strong>Sunset</strong>
                    <div>{new Date(weather.sunset).toLocaleTimeString('en-IN')}</div>
                  </div>
                )}
              </div>

              {weather.forecast?.length > 0 && (
                <>
                  <h3 style={{ marginTop: '1.5rem' }}>Short Forecast</h3>
                  <div className="forecast-row">
                    {weather.forecast.map((f) => (
                      <div className="forecast-item" key={f.time}>
                        <div>{new Date(f.time).toLocaleString('en-IN', { hour: '2-digit', weekday: 'short' })}</div>
                        <img
                          src={`https://openweathermap.org/img/wn/${f.icon}.png`}
                          alt={f.description}
                          style={{ margin: '0.25rem auto' }}
                        />
                        <strong>{Math.round(f.temp)}°C</strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {weather.advisory && (
              <div className="advisory-box">
                <h3>Agricultural Weather Advisory</h3>
                <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.92rem' }}>
                  General suggestions based on current weather. These are not verified
                  agronomic recommendations.
                </p>
                <ul style={{ paddingLeft: '1.1rem' }}>
                  {weather.advisory.tips.map((tip) => (
                    <li key={tip} style={{ marginBottom: '0.45rem' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
                <p className="disclaimer">{weather.advisory.disclaimer}</p>
              </div>
            )}
          </>
        )}

        {!weather && !loading && !error && (
          <div className="alert alert-info">
            Search for your city to load current weather from OpenWeather.
          </div>
        )}
      </div>
    </>
  );
};

export default Weather;
