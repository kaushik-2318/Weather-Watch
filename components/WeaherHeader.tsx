"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";
import { Search } from "@mui/icons-material";
import { getWeather } from "@/lib/api";
import { WeatherStoreType } from "@/lib/types";
import WeatherStore from "@/stores/weather-store";

type WeatherHeaderProps = {
  searchPanelOpen: boolean;
  setSearchPanelOpen: (searchPanelOpen: boolean) => void;
};
type WeatherData = {
  name: string;
  sys: { country: string };
};

export default function WeatherHeader({
  searchPanelOpen,
  setSearchPanelOpen,
}: WeatherHeaderProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const store: WeatherStoreType = WeatherStore();
  const { currentlat, currentlon, fetchWeatherData, currentCoordinate, unit } =
    store;

  useEffect(() => {
    if (currentlat && currentlon) {
      const res = getWeather(currentlat, currentlon, "metric");
      res.then((data) => {
        setData(data);
        console.log(data);
      });
    }
  }, [currentlat, currentlon]);

  const handleClick = () => {
    if (currentlat && currentlon) {
      currentCoordinate(currentlat, currentlon);
      fetchWeatherData({ lat: currentlat, lon: currentlon, unit: "metric" });
    }
  };

  return (
    <>
      <nav className="fixed w-full flex justify-center items-center z-50">
        <div className="flex items-center justify-between w-[98%] px-4 md:px-10 py-3 mt-3 backdrop-blur-md bg-black/10 text-white rounded-3xl">
          <h1 className="text-sm md:text-lg font-bold tracking-widest ">Weather Watch</h1>
          {data && (
            <div
              onClick={() => {
                handleClick();
              }}
              className="flex items-center gap-1 hover:underline cursor-pointer text-xs md:text-sm"
            >
              <LocationOnIcon fontSize="small" />
              <span>
                Weather in {data.name} / {data.sys.country}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant={"ghost"}
              className="cursor-pointer"
              onClick={() => setSearchPanelOpen(!searchPanelOpen)}
            >
              <Search />
            </Button>

            <Button
              variant="ghost"
              className="rounded-xl cursor-pointer border bg-none"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              History
            </Button>
          </div>
        </div>
      </nav>
      {isSidePanelOpen && (
        <SidePanel
          isSidePanelOpen={isSidePanelOpen}
          setIsSidePanelOpen={setIsSidePanelOpen}
          fetchWeatherData={fetchWeatherData}
          unit={unit}
        />
      )}
    </>
  );
}

const SidePanel = ({
  setIsSidePanelOpen,
  fetchWeatherData,
  unit,
}: {
  isSidePanelOpen: boolean;
  unit: string;
  fetchWeatherData: ({
    lat,
    lon,
    unit,
  }: {
    lat: number;
    lon: number;
    unit: string;
  }) => void;
  setIsSidePanelOpen: (isSidePanelOpen: boolean) => void;
}) => {
  const HistoryItem: { name: string; lat: number; lon: number }[] =
    localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history")!)
      : [];

  const handleClick = (item: { lat: number; lon: number; name: string }) => {
    fetchWeatherData({
      lat: item.lat,
      lon: item.lon,
      unit: unit,
    });
  };

  return (
    <div
      className={`fixed right-0 top-0 w-3xs md:w-1/6 min-h-screen flex flex-col gap-4 backdrop-blur-2xl bg-black/20 border-l border-white/20 z-50 transition-all duration-300 ease-in-out p-5`}
    >
      <div className="absolute top-3 right-3">
        <Button
          onClick={() => setIsSidePanelOpen(false)}
          variant={"default"}
          className="cursor-pointer w-10 h-8"
        >
          <CloseIcon className="text-xs" />
        </Button>
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-widest">
          History
        </h2>
        <div className="flex flex-col gap-2">
          {HistoryItem.length > 0 ? (
            HistoryItem.map((item, index) => (
              <div
                key={index}
                className="w-full"
                onClick={() => handleClick(item)}
              >
                <h3 className="text-sm hover:text-white hover:bg-white/10 px-2 py-2 rounded-sm transition-all duration-300 ease-in-out cursor-pointer">
                  {item?.name}
                </h3>
              </div>
            ))
          ) : (
            <div className="text-center text-white/50">No History Found</div>
          )}
        </div>
      </div>
    </div>
  );
};
