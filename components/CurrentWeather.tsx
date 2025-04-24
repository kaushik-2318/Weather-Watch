import React, { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { WeatherStoreType } from "@/lib/types";
import { getFormattedDate, getFormattedTime } from "@/lib/formattedTime";
import { motion } from "framer-motion";
import TemperatureUnitToggle from "./TemperatureUnitToggle";
import { Button } from "@heroui/button";
import {
  Refresh,
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Grain as RainIcon,
  Thunderstorm as StormIcon,
  AcUnit as SnowIcon,
  WbTwilight as SunsetIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Visibility as VisibilityIcon,
  Thermostat as TempIcon,
} from "@mui/icons-material";
import { Badge } from "./ui/badge";
import WeatherStore from "@/stores/weather-store";
import Loader from "./Loader";

export default function CurrentWeather({
  units,
  onToggleUnits,
}: {
  units: string;
  onToggleUnits: () => void;
}) {
  const [greeting, setGreeting] = useState("");
  const store: WeatherStoreType = WeatherStore();
  const { weatherData, isLoading } = store;

  useEffect(() => {
    const hour = weatherData?.dt
      ? parseInt(getFormattedTime(weatherData.dt).split(":")[0])
      : 0;
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }
  }, [weatherData?.dt]);

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

  const airQuality = {
    index: Math.floor(Math.random() * 150) + 20,
    level: function () {
      if (this.index <= 50) return { text: "Good", color: "#48bb78" };
      if (this.index <= 100) return { text: "Moderate", color: "#FFEB3B" };
      return { text: "Poor", color: "#f44336" };
    },
  };
  return (
    <div>
      <Card
        className={`overflow-hidden relative rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-500`}
      >
        {isLoading ? (
          <div>
            <Loader />
          </div>
        ) : (
          weatherData && (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex flex-col gap-3">
                    <h5 className="font-bold text-2xl">{weatherData.name}</h5>
                    <p className="text-white/50 text-sm">
                      {greeting} • {getFormattedDate(weatherData.dt)}
                    </p>
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <TemperatureUnitToggle
                      unit={units === "metric" ? "C" : "F"}
                      onUnitChange={onToggleUnits}
                    />
                    <div>
                      <Button
                        onClick={() => {}}
                        className="rounded-full cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300  text-gray-300 hover:text-white hover:rotate-12"
                      >
                        <Refresh />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardDescription>
                <div className="flex flex-col gap-6 px-6">
                  <div className="flex">
                    <div className=" bg-black/40 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {getWeatherIcon(weatherData.weather[0].main)}
                        </div>
                        <div>
                          <motion.div
                            key={`${weatherData?.main.temp}-${
                              units === "metric" ? "C" : "F"
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="text-7xl font-bold text-white">
                              {weatherData?.main.temp}°
                              {units === "metric" ? "C" : "F"}
                            </div>
                          </motion.div>

                          <div className="flex gap-2 mt-2">
                            <Badge
                              variant={"outline"}
                              className="bg-blue-500/20 text-blue-200"
                            >
                              <span className="rounded-xl text-sm">
                                {weatherData?.weather[0].main}
                              </span>
                            </Badge>
                            <Badge variant={"outline"}>
                              <span className="text-gray-300 text-sm flex justify-center items-center">
                                <TempIcon
                                  sx={{ fontSize: "0.8rem !important" }}
                                />
                                Feels like: {weatherData?.main.feels_like}°
                                {units === "metric" ? "C" : "F"}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-2 text-gray-300">
                        <HumidityIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <div className="text-2xl font-semibold text-white mt-1">
                        {weatherData?.main.humidity}%
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-2 text-gray-300">
                        <WindIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Wind</span>
                      </div>
                      <div className="text-2xl font-semibold text-white mt-1">
                        {weatherData?.wind.speed} km/h
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-2 text-gray-300">
                        <VisibilityIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Visibility</span>
                      </div>
                      <div className="text-2xl font-semibold text-white mt-1">
                        {weatherData?.visibility / 1000} km
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-2 text-gray-300">
                        <SunsetIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Sunrise</span>
                      </div>
                      <div className="text-2xl font-semibold text-white mt-1">
                        {getFormattedTime(weatherData?.sys.sunrise)}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-2 text-gray-300">
                        <SunsetIcon
                          color="primary"
                          fontSize={"small"}
                          className="w-5 h-5"
                        />
                        <span className="text-sm">Sunset</span>
                      </div>
                      <div className="text-2xl font-semibold text-white mt-1">
                        {getFormattedTime(weatherData?.sys.sunset)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-black/40">
                    <div className="flex justify-between items-center text-sm text-white">
                      <span>Air Quality Index</span>
                      <span
                        className={`px-2 py-1 rounded-full text-white`}
                        style={{ backgroundColor: airQuality.level().color }}
                      >
                        {airQuality.level().text}
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full  transition-all duration-1000  `}
                        style={{
                          width: `${Math.min(airQuality.index / 2, 100)}%`,
                          backgroundColor: airQuality.level().color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardDescription>
            </>
          )
        )}
      </Card>
    </div>
  );
}
