"use client";

import { useState, useEffect, useCallback } from "react";
import WeatherHeader from "@/components/WeaherHeader";
import CurrentWeather from "@/components/CurrentWeather";
import LineGraph from "@/components/LineGraph";
import PieGraph from "@/components/PieGraph";
import RadarGraph from "@/components/RadarGraph";
import WeatherStore from "@/stores/weather-store";
import LocationStore from "@/stores/location-store";
import SearchPanel from "@/components/SearchPanel";
import { WeatherStoreType } from "@/lib/types";
import DailyForecast from "@/components/DailyForecast";

export default function WeatherDashboard() {
  const store: WeatherStoreType = WeatherStore();
  const { weatherData, forecastData, fetchWeatherData, currentCoordinate } =
    store;

  const latitude = LocationStore((state) => state.latitude);
  const longitude = LocationStore((state) => state.longitude);
  const updateLocation = LocationStore((state) => state.updateLocation);

  const unit = WeatherStore((state) => state.unit);
  const setUnit = WeatherStore((state) => state.setUnit);

  const [background, setBackgroundImage] = useState<string | null>(null);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);

  const fetchData = useCallback(
    async ({ lat, lon, unit }: { lat: number; lon: number; unit: string }) => {
      fetchWeatherData({ lat, lon, unit });
    },
    [fetchWeatherData]
  );

  const getCityByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      updateLocation(data.latitude, data.longitude);
      currentCoordinate(data.latitude, data.longitude);
    } catch (error) {
      console.error("Failed to fetch location by IP:", error);
      throw new Error("Unable to fetch location by IP");
    }
  };

  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
          });
        }
      );
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      updateLocation(lat, lon);
      currentCoordinate(lat, lon);
    } catch (error) {
      console.error("Error getting location:", error);
      await getCityByIP();
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchData({ lat: latitude, lon: longitude, unit });
    }
  }, [latitude, longitude, unit, fetchData]);

  const toggleUnits = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
    if (weatherData && forecastData && latitude && longitude) {
      fetchData({
        lat: latitude,
        lon: longitude,
        unit: unit === "metric" ? "imperial" : "metric",
      });
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) {
      setBackgroundImage("/backgrounds/morning.png");
    } else if (hour >= 16 && hour < 19) {
      setBackgroundImage("/backgrounds/evening.jpg");
    } else {
      setBackgroundImage("/backgrounds/night.jpg");
    }
  }, []);

  return (
    <>
      {searchPanelOpen && (
        <SearchPanel setSearchPanelOpen={setSearchPanelOpen} />
      )}
      <div
        className={`min-h-screen`}
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div>
          <WeatherHeader
            searchPanelOpen={searchPanelOpen}
            setSearchPanelOpen={setSearchPanelOpen}
          />
        </div>
        <div className="p-4 pt-24">
          <div className="flex gap-10 flex-col xl:flex-row items-center justify-center">
            <div className="xl:w-[60%] ">
              <CurrentWeather units={unit} onToggleUnits={toggleUnits} />
            </div>
            <div className="flex flex-col gap-5 xl:w-[40%] w-full">
              <div className="h-[230px]">
                <LineGraph />
              </div>
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="h-[230px] p-2 w-full sm:w-[60%] shadow-sm border bg-white/10 rounded-xl">
                  <RadarGraph />
                </div>
                <div className="h-[230px] p-2 w-full sm:w-[40%] shadow-sm border bg-white/10 rounded-xl">
                  <PieGraph />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-4">
          <DailyForecast />
        </div>
      </div>
    </>
  );
}
