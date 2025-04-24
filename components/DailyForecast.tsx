"use client";

import {
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Grain as RainIcon,
  Thunderstorm as StormIcon,
  AcUnit as SnowIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Visibility as VisibilityIcon,
  Thermostat as TempIcon,
} from "@mui/icons-material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { DailyForecastItem, WeatherStoreType } from "@/lib/types";
import WeatherStore from "@/stores/weather-store";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "./ui/card";
import { useState } from "react";
import { Gauge } from "lucide-react";

export default function DailyForecast() {
  const [hoveredDay, setHoveredDay] = useState<DailyForecastItem | null>(null);
  const store: WeatherStoreType = WeatherStore();
  const { forecastData } = store;

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

  console.log(forecastData);
  const dailyForecast = forecastData?.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 7)
    .map((item) => {
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

        feel: item.main.feels_like,
        pop: item.pop,
        wind: item.wind.speed,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        visibility: item.visibility,
      };
    });

  const getWeatherIcon = (condition: string) => {
    const iconProps = {
      sx: {
        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
        transition: "all 0.3s ease",
        animation: "pulse 2s infinite ease-in-out",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
    };

    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return (
          <SunIcon
            {...iconProps}
            sx={{ ...iconProps.sx, color: "#FFD700" }}
            fontSize="large"
          />
        );
      case "cloudy":
      case "partly cloudy":
      case "overcast":
        return (
          <CloudIcon
            {...iconProps}
            sx={{ ...iconProps.sx, color: "#A9A9A9" }}
            fontSize="large"
          />
        );
      case "rainy":
      case "rain":
      case "drizzle":
        return (
          <RainIcon
            {...iconProps}
            sx={{ ...iconProps.sx, color: "#4682B4" }}
            fontSize="large"
          />
        );
      case "thunderstorm":
      case "storm":
        return (
          <StormIcon
            {...iconProps}
            sx={{ ...iconProps.sx, color: "#4B0082" }}
            fontSize="large"
          />
        );
      case "snow":
      case "snowy":
      case "sleet":
        return (
          <SnowIcon
            {...iconProps}
            sx={{ ...iconProps.sx, color: "#E0FFFF" }}
            fontSize="large"
          />
        );
      default:
        return (
          <SunIcon
            {...iconProps}
            sx={{ ...iconProps.sx, color: "#FFD700" }}
            fontSize="large"
          />
        );
    }
  };

  return (
    <>
      <div className="flex gap-10 flex-col md:flex-row items-center justify-center h-[270px]">
        <div className="w-[60%]">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-500">
            <CardTitle>
              <h1 className="px-7">5 Day Forecast</h1>
            </CardTitle>
            <CardContent>
              <div className="flex duration-500 gap-2.5">
                {dailyForecast?.map((day, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[120px] md:w-auto rounded-2xl p-3 text-white text-center bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-500 hover:scale-105 cursor-pointer"
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <p className="font-bold text-sm mb-1">{day.day}</p>
                    <p className="text-xs opacity-70 mb-3">{day.date}</p>
                    <div className="flex justify-center gap-2 mb-2 text-sm">
                      <span className="opacity-70">min: +{day.minTemp}°</span>
                      <span className="font-semibold">
                        max: +{day.maxTemp}°
                      </span>
                    </div>
                    <div className="h-12 flex items-center justify-center mb-2">
                      {getWeatherIcon(day.icon)}
                    </div>
                    <p className="text-xs opacity-90">{day.condition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col justify-between items-center md:w-[40%] h-full">
          <div className="h-full w-full">
            <Card className="h-full w-full bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-500">
              <CardTitle>
                <h1 className="px-7 text-center">More Detail</h1>
              </CardTitle>
              <CardContent className="text-sm px-7 py-3">
                {hoveredDay ? (
                  <div className="flex flex-row justify-center items-center gap-10 text-base">
                    <div className="h-20 flex items-center justify-center mb-2">
                      {getWeatherIcon(hoveredDay.icon)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex  items-center gap-2">
                        <WindIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        Wind: {hoveredDay.wind} m/s
                      </div>
                      <div className="flex  items-center gap-2">
                        <HumidityIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        Humidity:{hoveredDay.humidity}%
                      </div>
                      <div className="flex  items-center gap-2">
                        <VisibilityIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        Visibility
                        {hoveredDay.visibility} m
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex  items-center gap-2">
                        <TempIcon sx={{ fontSize: "0.8rem !important" }} />
                        Feels Like: {hoveredDay.feel}°
                      </div>
                      <div className="flex  items-center gap-2">
                        <WaterDropIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        Pop: {hoveredDay.pop}%
                      </div>
                      <div className="flex  items-center gap-2">
                        <Gauge size={20} color="#007bff" strokeWidth={2} />
                        Pressure: {hoveredDay.pressure} hPa
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="opacity-70 text-center">
                    Hover over a forecast card to learn more.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="text-sm text-center flex gap-1 justify-center items-center w-full h-10">
            Designed and Built by{" "}
            <span className="text-blue-500 underline font-bold">
              <Link href="https://kaushikverma.me/" target="_blank">
                Kaushik Verma
              </Link>
            </span>{" "}
            with Next JS, Chart.js, and OpenWeatherAPI.
          </div>
        </div>
      </div>
    </>
  );
}
