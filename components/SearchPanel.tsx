"use client";

import { Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import WeatherStore from "@/stores/weather-store";
import LocationStore from "@/stores/location-store";
import { searchLocation } from "@/lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface SearchPanelProps {
  setSearchPanelOpen: (open: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

interface LocationResult {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export default function SearchPanel({
  setSearchPanelOpen,
  menuRef,
  inputRef,
}: SearchPanelProps) {
  const { updateLocation } = LocationStore();
  const { weatherData } = WeatherStore();
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [history, setHistory] = useState<
    { name: string; lat: number; lon: number }[]
  >([]);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const country = weatherData?.sys.country;

  useEffect(() => {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    if (!input) {
      setSearchResults([]);
      setError("");
      return;
    }
    const handleSearch = async (query: string) => {
      setError("");
      try {
        const res = await searchLocation(query, "metric", country);
        const data = await res.json();
        if (data.length) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
          const res = await searchLocation(query, "metric");
          const data = await res.json();
          if (data.length) {
            setSearchResults(data);
          } else {
            setSearchResults([]);
            setError("No results found");
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Error searching for location");
        setError("No results found");
      }
    };
    const timer = setTimeout(() => handleSearch(input.trim()), 300);
    return () => clearTimeout(timer);
  }, [input, history, country]);

  const changeDestination = (name: string, lat: number, lon: number) => {
    const cityName = name.trim();
    const existingIndex = history.findIndex(
      (item) => item.name.toLowerCase() === cityName.toLowerCase()
    );

    let updatedHistory = [...history];
    if (existingIndex !== -1) {
      updatedHistory.splice(existingIndex, 1);
    }

    updatedHistory = [{ name: cityName, lat, lon }, ...updatedHistory].slice(
      0,
      5
    );
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    updateLocation(lat, lon);
    setInput("");
    setSearchResults([]);
    setSearchPanelOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed z-40 flex items-center justify-center w-full h-screen overflow-hidden duration-500 backdrop-blur-xl"
      onClick={() => setSearchPanelOpen(false)}
    >
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
          <Search />
        </div>
        <input
          type="search"
          id="search"
          className="block max-w-[600px] w-[350px] sm:w-[500px] lg:w-[600px] p-4 ps-10 text-sm text-white rounded-lg backdrop-blur-xl bg-black/40 outline-none"
          placeholder="Enter City..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
        />

        {searchResults.length > 0 ? (
          <div
            className="absolute backdrop-blur-xl bg-black/40 text-white font-light mt-2 rounded-md p-2 w-[600px] max-h-[250px] overflow-y-auto scroll-m-10 shadow-lg"
            ref={menuRef}
          >
            <div className="p-1">
              <h3 className="font-semibold tracking-wider">Cities</h3>
              {error && <div className="text-red-500 mt-2">{error}</div>}
              <ul>
                {searchResults.map((detail, index) => (
                  <li
                    className="pl-4 py-2 cursor-pointer hover:bg-white/10 duration-200 rounded-md"
                    onClick={() =>
                      changeDestination(detail.name, detail.lat, detail.lon)
                    }
                    key={index}
                  >
                    {detail.name}, {detail.state || ""}, {detail.country}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
