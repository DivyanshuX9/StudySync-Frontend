import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const WeatherContext = createContext();

// Open-Meteo WMO weather codes → our condition keys
// 16 tones: sunny_day, sunny_night, cloudy_day, cloudy_night,
//           partly_cloudy_day, partly_cloudy_night, overcast_day, overcast_night,
//           drizzle_day, drizzle_night, rain_day, rain_night,
//           thunderstorm_day, thunderstorm_night, snow_day, snow_night
function wmoToCondition(code) {
  if (code === 0)                    return { label: "Clear",         key: "sunny",         icon: "☀️" };
  if (code <= 2)                     return { label: "Partly Cloudy", key: "partly_cloudy",  icon: "⛅" };
  if (code === 3)                    return { label: "Overcast",      key: "overcast",       icon: "☁️" };
  if (code <= 49)                    return { label: "Foggy",         key: "cloudy",         icon: "🌫️" };
  if (code <= 57)                    return { label: "Drizzle",       key: "drizzle",        icon: "🌦️" };
  if (code <= 67)                    return { label: "Rainy",         key: "rain",           icon: "🌧️" };
  if (code <= 77)                    return { label: "Snowy",         key: "snow",           icon: "❄️" };
  if (code <= 82)                    return { label: "Rain Showers",  key: "rain",           icon: "🌧️" };
  if (code <= 86)                    return { label: "Snow Showers",  key: "snow",           icon: "🌨️" };
  if (code >= 95)                    return { label: "Thunderstorm",  key: "thunderstorm",   icon: "⛈️" };
  return                                    { label: "Cloudy",        key: "cloudy",         icon: "☁️" };
}

function getTimeOfDay() {
  const h = new Date().getHours();
  return h >= 6 && h < 20 ? "day" : "night";
}

async function geocodeCity(city) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const data = await res.json();
  if (!data.results?.length) throw new Error("City not found");
  const { latitude, longitude, name, country } = data.results[0];
  return { lat: latitude, lon: longitude, name: `${name}, ${country}` };
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,precipitation&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();
  const c = data.current;
  const condition = wmoToCondition(c.weathercode);
  return {
    temp: Math.round(c.temperature_2m),
    wind: Math.round(c.windspeed_10m),
    precip: c.precipitation?.toFixed(1) ?? "0.0",
    condition,
    timeOfDay: getTimeOfDay(),
  };
}

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Detecting…");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // isNight is the day/night toggle — starts from real time, user can flip it
  const [isNight, setIsNight] = useState(() => getTimeOfDay() === "night");

  const loadWeather = useCallback(async (lat, lon, name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setIsNight(data.timeOfDay === "night");
      setLocation(name);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const { lat, lon, name } = await geocodeCity(city);
      await loadWeather(lat, lon, name);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [loadWeather]);

  useEffect(() => {
    if (!navigator.geolocation) {
      loadWeather(28.6139, 77.2090, "New Delhi, India");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const d = await res.json();
          const name = d.address?.city || d.address?.town || d.address?.state || "Your Location";
          loadWeather(lat, lon, name);
        } catch {
          loadWeather(lat, lon, "Your Location");
        }
      },
      () => loadWeather(28.6139, 77.2090, "New Delhi, India")
    );
  }, [loadWeather]);

  // Expose the full tone key: e.g. "rain_night", "sunny_day"
  const toneKey = weather
    ? `${weather.condition.key}_${isNight ? "night" : "day"}`
    : "sunny_day";

  return (
    <WeatherContext.Provider value={{
      weather, location, loading, error, searchCity,
      isNight, setIsNight, toneKey,
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
