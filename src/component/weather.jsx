import { useState, useEffect } from 'react';
import axios from 'axios';
import './weather.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function Weather({ onSearchSuccess, selectedCity }) {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeather = async (city) => {
    if (!city.trim()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const requestUrl = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(requestUrl);

      setWeatherData(response.data);
      onSearchSuccess?.(response.data.name);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorMessage(`City "${city}" not found. Please check spelling.`);
      } else {
        setErrorMessage('Failed to fetch weather data. Please try again later.');
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      setCityInput(selectedCity);
      fetchWeather(selectedCity);
    }
  }, [selectedCity]);

  const handleInputChange = (event) => {
    setCityInput(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!cityInput.trim()) {
      setErrorMessage('Please enter a city name.');
      return;
    }
    fetchWeather(cityInput);
  };

  return (
    <div className="weather-wrapper-card">
      {/* Header Info */}
      <div className="weather-header-info">
        <h1>Weather Report</h1>
        <p>What climate do you want to know today?</p>
      </div>

      {/* Form Input + Button */}
      <form className="weather-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="weather-input"
          placeholder="Enter city, e.g. Chennai"
          value={cityInput}
          onChange={handleInputChange}
        />
        <button type="submit" className="weather-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="weather-error" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Weather Result Section */}
      {weatherData && !errorMessage && (
        <article className="weather-result-box">
          <h2 className="weather-location">
            {weatherData.name}, {weatherData.sys.country}
          </h2>

          <div className="weather-temp">
            {Math.round(weatherData.main.temp)}°C
          </div>

          <p className="weather-description">
            {weatherData.weather[0].description}
          </p>

          <ul className="weather-details-grid">
            <li>
              <span>Feels Like</span>
              <strong>{Math.round(weatherData.main.feels_like)}°C</strong>
            </li>
            <li>
              <span>Humidity</span>
              <strong>{weatherData.main.humidity}%</strong>
            </li>
            <li>
              <span>Wind Speed</span>
              <strong>{weatherData.wind.speed} m/s</strong>
            </li>
          </ul>
        </article>
      )}
    </div>
  );
}

export default Weather;