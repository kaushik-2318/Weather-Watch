"use client";

import { useState } from "react";
import { WbSunny, Cloud, Thunderstorm, Grain } from "@mui/icons-material";

interface ForecastDay {
  day: string;
  date: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  condition: string;
}

export default function DailyForecast({
  forecast,
}: {
  forecast: ForecastDay[];
}) {
  const [showAllDays, setShowAllDays] = useState(false);

  if (!forecast || forecast.length === 0) return null;

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return (
          <WbSunny className="text-yellow-400" style={{ fontSize: "2.5rem" }} />
        );
      case "cloudy":
        return <Cloud className="text-white" style={{ fontSize: "2.5rem" }} />;
      case "partly_cloudy":
        return (
          <Cloud
            className="text-white opacity-70"
            style={{ fontSize: "2.5rem" }}
          />
        );
      case "thunderstorm":
        return (
          <Thunderstorm
            className="text-gray-400"
            style={{ fontSize: "2.5rem" }}
          />
        );
      case "light_rain":
        return (
          <Grain className="text-gray-400" style={{ fontSize: "2.5rem" }} />
        );
      default:
        return <Cloud className="text-white" style={{ fontSize: "2.5rem" }} />;
    }
  };

  const displayedForecast = showAllDays ? forecast : forecast.slice(0, 5);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-semibold text-sm">TODAY</span>
        <button
          onClick={() => setShowAllDays(!showAllDays)}
          className="text-white uppercase text-xs font-medium hover:underline"
        >
          {showAllDays ? "Show Less" : "Show For 10 Days"}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto md:overflow-visible pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
        {displayedForecast.map((day, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[120px] md:w-auto bg-black/30 backdrop-blur-md rounded-2xl p-3 text-white text-center"
          >
            <p className="font-bold text-sm mb-1">{day.day}</p>
            <p className="text-xs opacity-70 mb-3">{day.date}</p>

            <div className="flex justify-center gap-2 mb-2 text-sm">
              <span className="opacity-70">min: +{day.minTemp}°</span>
              <span className="font-semibold">max: +{day.maxTemp}°</span>
            </div>

            <div className="h-12 flex items-center justify-center mb-2">
              {getWeatherIcon(day.icon)}
            </div>

            <p className="text-xs opacity-90">{day.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
