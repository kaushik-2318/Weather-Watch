"use client";

import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

export default function WeatherDetails({
  details,
}: {
  details: {
    windSpeed: string;
    humidity: string;
    pressure: string;
    precipitation: string;
  };
}) {
  if (!details) return null;

  return (
    <div className="backdrop-blur-md bg-black/30 rounded-xl p-4 text-white mb-4">
      <p className="text-sm font-bold mb-4">MORE DETAILS:</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AirIcon fontSize="small" />
          <p className="text-sm">Wind speed: {details.windSpeed}</p>
        </div>

        <div className="flex items-center gap-2">
          <OpacityIcon fontSize="small" />
          <p className="text-sm">Air humidity: {details.humidity}</p>
        </div>

        <div className="flex items-center gap-2">
          <CompareArrowsIcon fontSize="small" />
          <p className="text-sm">Pressure: {details.pressure}</p>
        </div>

        <div className="flex items-center gap-2">
          <WaterDropIcon fontSize="small" />
          <p className="text-sm">
            Precipitation probability: {details.precipitation}
          </p>
        </div>
      </div>
    </div>
  );
}
