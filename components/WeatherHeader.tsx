"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "@mui/icons-material";
import { getWeather } from "@/lib/api";
import { WeatherStoreType } from "@/lib/types";
import WeatherStore from "@/stores/weather-store";
import { AnimatePresence } from "framer-motion";
import HistoryPanel from "./HistoryPanel";

type WeatherHeaderProps = {
  searchPanelOpen: boolean;
  setSearchPanelOpen: (searchPanelOpen: boolean) => void;
  searchButtonRef: React.RefObject<HTMLButtonElement>;
};
type WeatherData = {
  name: string;
  sys: { country: string };
};

export default function WeatherHeader({
  searchPanelOpen,
  searchButtonRef,
  setSearchPanelOpen,
}: WeatherHeaderProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const store: WeatherStoreType = WeatherStore();
  const { currentlat, currentlon, fetchWeatherData, currentCoordinate, unit } =
    store;
  const historyMenuRef = useRef<HTMLDivElement>(null);
  const historyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentlat && currentlon) {
      const res = getWeather(currentlat, currentlon, "metric");
      res.then((data) => {
        setData(data);
      });
    }
  }, [currentlat, currentlon]);

  const handleClick = () => {
    if (currentlat && currentlon) {
      currentCoordinate(currentlat, currentlon);
      fetchWeatherData({ lat: currentlat, lon: currentlon, unit: "metric" });
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        historyMenuRef.current &&
        !historyMenuRef.current.contains(e.target as Node) &&
        historyButtonRef.current &&
        !historyButtonRef.current.contains(e.target as Node)
      ) {
        setIsSidePanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [historyMenuRef, historyButtonRef]);

  useEffect(() => {
    if (historyMenuRef.current) {
      historyMenuRef.current.focus();
    }
  });

  return (
    <>
      <nav className="fixed w-full flex justify-center items-center z-[52]">
        <div className="flex items-center justify-between w-[98%] px-4 md:px-10 py-3 mt-3 backdrop-blur-md bg-black/10 text-white rounded-3xl">
          <h1 className="text-sm md:text-lg font-bold tracking-widest ">
            Weather Watch
          </h1>
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
              ref={searchButtonRef}
            >
              <Search />
            </Button>

            <Button
              variant="ghost"
              className="rounded-xl cursor-pointer border bg-none"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              ref={historyButtonRef}
            >
              History
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSidePanelOpen && (
          <HistoryPanel
            isSidePanelOpen={isSidePanelOpen}
            setIsSidePanelOpen={setIsSidePanelOpen}
            fetchWeatherData={fetchWeatherData}
            unit={unit}
            historyMenuRef={historyMenuRef}
          />
        )}
      </AnimatePresence>
    </>
  );
}
