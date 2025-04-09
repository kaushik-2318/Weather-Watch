"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";

export default function WeatherHeader({
  location,
  units,
  onToggleUnits,
}: {
  location: { city: string; region: string };
  units: string;
  onToggleUnits: () => void;
  onToggleLanguage: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/10 text-white">
      <h1 className="text-lg font-bold tracking-widest">Weather Watch</h1>

      {location?.city && location?.region && (
        <div className="flex items-center gap-1 text-sm">
          <LocationOnIcon fontSize="small" />
          <span>
            {location.city} / {location.region}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleUnits}
          className="text-sm px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          °{units} / °{units === "C" ? "F" : "C"}
        </button>

        <button className="flex items-center gap-1 text-sm font-semibold tracking-wider hover:text-gray-300 transition">
          History <MenuIcon fontSize="small" />
        </button>
      </div>
    </header>
  );
}
