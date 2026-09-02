
import { useEffect, useState } from 'react';
import axios from 'axios';
import { WeatherContext } from './WeatherContext';

const API_KEY = 'dfc5645e40f7008439c71cec957922a7';

export function WeatherProvider({ children }) {
  const [cityInput, setCityInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    async function fetchWeatherData() {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            searchQuery,
          )}&units=metric&appid=${API_KEY}`,
        );
        setWeatherData(response.data);
      } catch (err) {
        setWeatherData(null);
        setError(err.response?.status === 404 ? 'City not found' : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, [searchQuery]);

  function handleSearch(event) {
    event.preventDefault();
    const city = cityInput.trim();
    if (city) {
      setSearchQuery(city);
      setCityInput('');
    }
  }

  return (
    <WeatherContext.Provider
      value={{ cityInput, setCityInput, weatherData, loading, error, handleSearch }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
