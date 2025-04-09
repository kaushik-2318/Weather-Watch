"use client";

import { useState, useEffect, useCallback } from "react";
import WeatherHeader from "@/components/WeaherHeader";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherDetails from "@/components/WeatherDetails";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import { ThemeProvider } from "@/components/ThemeProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { getWeather, getForecast } from "@/lib/api";

type ForecastApiItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { main: string; icon: string }[];
};

export default function WeatherDashboard() {
  const [location, setLocation] = useState({ city: "", region: "" });
  const [weather, setWeather] = useState<null | {
    date: string;
    temperature: number;
    feelsLike: number;
    description: string;
    condition: string;
    sunrise: string;
    sunset: string;
    details: {
      windSpeed: string;
      humidity: string;
      pressure: string;
      precipitation: string;
    };
  }>(null);
  const [forecast, setForecast] = useState<{
    hourly: {
      time: string;
      temp: number;
      icon: string;
    }[];
    daily: {
      day: string;
      date: string;
      minTemp: number;
      maxTemp: number;
      condition: string;
      icon: string;
    }[];
  }>({ hourly: [], daily: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [units, setUnits] = useState("C");
  const [language, setLanguage] = useState("EN");
  const [backgroundImage, setBackgroundImage] = useState("");

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError("");

    try {
      const apiData = await getWeather(lat, lon);
      const apiForecastData = await getForecast(lat, lon);

      const currentWeather = {
        date: new Date(apiData.dt * 1000).toLocaleDateString(),
        temperature: Math.round(apiData.main.temp),
        feelsLike: Math.round(apiData.main.feels_like),
        description: apiData.weather[0].description,
        condition: apiData.weather[0].main,
        sunrise: new Date(apiData.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sunset: new Date(apiData.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        details: {
          windSpeed: `${apiData.wind.speed} m/s`,
          humidity: `${apiData.main.humidity}%`,
          pressure: `${Math.round(apiData.main.pressure * 0.75006)} mm`,
          precipitation: "0 mm",
        },
      };

      setLocation({ city: apiData.name, region: apiData.sys.country });

      const hourlyForecast = apiForecastData.list
        .slice(0, 8)
        .map((item: ForecastApiItem) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: Math.round(item.main.temp),
          icon: mapWeatherIcon(item.weather[0].icon),
        }));

      const dailyForecast = apiForecastData.list
        .filter((item: ForecastApiItem) => item.dt_txt.includes("12:00:00"))
        .slice(0, 7)
        .map((item: ForecastApiItem) => {
          const date = new Date(item.dt * 1000);
          return {
            day: date
              .toLocaleDateString("en-US", { weekday: "long" })
              .toUpperCase(),
            date: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            minTemp: Math.round(item.main.temp_min),
            maxTemp: Math.round(item.main.temp_max),
            condition: item.weather[0].main,
            icon: mapWeatherIcon(item.weather[0].icon),
          };
        });

      setWeather(currentWeather);
      setForecast({ hourly: hourlyForecast, daily: dailyForecast });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherData(lat, lon);
        },
        () => {
          fetchWeatherData(28.6139, 77.209);
        }
      );
    } else {
      fetchWeatherData(28.6139, 77.209);
    }
  }, [fetchWeatherData]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 17) {
      setBackgroundImage("/backgrounds/day.jpg");
    } else if (hour >= 17 && hour < 20) {
      setBackgroundImage("/backgrounds/evening.jpg");
    } else {
      setBackgroundImage("/backgrounds/night.jpg");
    }
  }, []);

  const toggleUnits = () => setUnits(units === "C" ? "F" : "C");
  const toggleLanguage = () => setLanguage(language === "EN" ? "RU" : "EN");

  const mapWeatherIcon = (apiIcon: string) => {
    if (apiIcon.includes("01")) return "sunny";
    if (apiIcon.includes("02")) return "partly_cloudy";
    if (apiIcon.includes("03") || apiIcon.includes("04")) return "cloudy";
    if (apiIcon.includes("09") || apiIcon.includes("10")) return "light_rain";
    if (apiIcon.includes("11")) return "thunderstorm";
    if (apiIcon.includes("13")) return "snow";
    if (apiIcon.includes("50")) return "fog";
    return "cloudy";
  };

  return (
    <ThemeProvider>
      <div
        className="min-h-screen w-full relative text-white"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="relative z-10 flex flex-col min-h-screen">
          <WeatherHeader
            location={location}
            units={units}
            onToggleUnits={toggleUnits}
            onToggleLanguage={toggleLanguage}
          />

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <CircularProgress sx={{ color: "white" }} />
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
          ) : (
            <div className="max-w-6xl w-full mx-auto px-4 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="flex-1">
                  {weather && (
                    <CurrentWeather
                      weather={weather}
                      forecast={forecast.hourly}
                      units={units}
                    />
                  )}
                </div>
                <div className="flex-1">
                  {weather?.details && (
                    <WeatherDetails details={weather.details} />
                  )}
                  <HourlyForecast forecast={forecast.hourly} units={units} />
                </div>
              </div>
              <div className="mt-6 mb-6">
                <DailyForecast forecast={forecast.daily} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}