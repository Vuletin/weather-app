import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    if (!city) return;
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather({ error: 'City not found' });
      }
    } catch (error) {
      setWeather({ error: 'Error fetching weather data' });
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {weather && (
        <div id="result">
          {weather.error ? (
            <p>{weather.error}</p>
          ) : (
            <>
              <h2>{weather.name}, {weather.sys.country}</h2>
              <p>{weather.weather[0].description}</p>
              <p>🌡️ Temp: {weather.main.temp} °C</p>
              <p>💨 Wind: {weather.wind.speed} m/s</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
