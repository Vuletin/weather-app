import { useState, useRef, useEffect } from "react";
import "./App.css";

const capitalizeWords = (str) =>
  str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const geoKey = process.env.REACT_APP_GEODB_API_KEY;
const BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [history, setHistory] = useState([]);

  const getLocalTime = (timezoneOffset) => {
    const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezoneOffset * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getWeather = async (selectedCity) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/weather?city=${encodeURIComponent(selectedCity)}`
    );

    const data = await response.json();

    if (!response.ok || data.cod !== 200) {
      console.error("Weather API error:", data.message || "Unknown error");
      setWeather(null);
      return;
    }

    setWeather(data);
    setSuggestions([]);

    // ✅ Fetch and process forecast
    const forecastRes = await fetch(
      `${BASE_URL}/api/weather/forecast?city=${encodeURIComponent(selectedCity)}`
    );
    const forecastData = await forecastRes.json();

    if (forecastRes.ok && forecastData.list) {
      const dailyMap = {};
      forecastData.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyMap[date] || entry.dt_txt.includes("12:00:00")) {
          dailyMap[date] = entry;
        }
      });
      setForecast(Object.values(dailyMap).slice(0, 5));
    } else {
      setForecast([]);
    }

    // ✅ Fetch history
    const historyRes = await fetch(`${BASE_URL}/api/weather/history?city=${encodeURIComponent(selectedCity)}`);
    const historyData = await historyRes.json();
    setHistory(historyData);

  } catch (err) {
    console.error("Error getting weather:", err);
  }
};

  const fetchSuggestions = async (query) => {
    console.log("GeoDB API Key:", geoKey);

    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5&sort=-population`,
        {
          headers: {
            "X-RapidAPI-Key": geoKey,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      const result = await response.json();
      setSuggestions(result?.data || []);
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
    setHighlightIndex(-1);
    fetchSuggestions(e.target.value);
  };

  const handleSuggestionClick = (name, countryCode) => {
    if (!name || !countryCode) return;

    const formatted = `${capitalizeWords(name)}, ${countryCode.toUpperCase()}`;
    setCity(formatted);
    setSuggestions([]);
    getWeather(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      getWeather(city.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        const selected = suggestions[highlightIndex];
        handleSuggestionClick(selected.name, selected.countryCode);
      } else {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            position: "relative",
            width: "250px",
            marginBottom: suggestions.length > 0 ? "160px" : "1em",
          }}
        >
          <input
            type="text"
            value={city}
            onChange={handleInputChange} 
            onKeyDown={handleKeyDown}
            placeholder="Enter city..."
            ref={inputRef}
            className="your-input-class"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className={i === highlightIndex ? "highlight" : ""}
                  onClick={() => handleSuggestionClick(s.name, s.countryCode)}
                >
                  {s.name}, {s.country}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Get Weather</button>
      </form>

      {weather && weather.name && weather.sys && (
        <div id="result">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>💨 {weather.wind.speed} m/s</p>
          <p>🌫️ {weather.weather[0].description}</p>
          <p>🕒 Local time: {getLocalTime(weather.timezone)}</p>
        </div>
      )}
      {forecast.length > 0 && (
        <div>
          <h3>📅 5-Day Forecast</h3>
          <ul style={{ display: "flex", gap: "1em", padding: 0, listStyle: "none" }}>
            {forecast.map((day, i) => (
              <li key={i} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1em" }}>
                <strong>
                  {new Date(day.dt_txt).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
                <br />
                🌡️ {day.main.temp}°C<br />
                {day.weather[0].description}<br />
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="icon"
                  style={{ width: "40px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3>🔁 Recent Searches</h3>
      {history.length > 0 && (
        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
          <ul>
            {history.map((entry, i) => (
              <li key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "1em",
                marginBottom: "0.8em",
                padding: "0.5em",
                borderBottom: "1px solid #ccc"
              }}>
                <span style={{ fontWeight: "bold" }}>{entry.city}</span>

                {entry.temp !== undefined && (
                  <span>🌡️ {entry.temp}°C</span>
                )}

                {entry.description && (
                  <span>{entry.description}</span>
                )}

                {entry.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${entry.icon}@2x.png`}
                    alt="weather icon"
                    style={{ width: "30px", height: "30px" }}
                  />
                )}

                {entry.timezone && (
                  <span style={{ color: "#666", fontSize: "0.85em" }}>
                    🕒 {getLocalTime(entry.timezone)}
                  </span>
                )}

                {entry.searchedAt && (
                  <span style={{ color: "#aaa", fontSize: "0.8em" }}>
                    ⏱ {new Date(entry.searchedAt).toLocaleTimeString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
