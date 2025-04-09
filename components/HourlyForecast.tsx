"use client";

import { WbSunny, Cloud, NightsStay } from "@mui/icons-material";

export default function HourlyForecast({
  forecast,
  units,
}: {
  forecast: { icon: string; temp: number; time: string }[];
  units: string;
}) {
  if (!forecast || forecast.length === 0) return null;

  const getWeatherIcon = (icon: string) => {
    if (icon.includes("night"))
      return (
        <NightsStay className="text-white" style={{ fontSize: "1.5rem" }} />
      );
    if (icon.includes("cloudy"))
      return <Cloud className="text-white" style={{ fontSize: "1.5rem" }} />;
    return (
      <WbSunny className="text-yellow-400" style={{ fontSize: "1.5rem" }} />
    );
  };

  const timeOfDayOrder = ["NIGHT", "MORNING", "DAY", "EVENING"];

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 text-white w-full">
      <div className="flex justify-between mb-3">
        {timeOfDayOrder.map((timeOfDay) => (
          <span key={timeOfDay} className="text-sm font-medium opacity-80">
            {timeOfDay}
          </span>
        ))}
      </div>

      {/* Forecast Blocks */}
      <div className="flex justify-between">
        {forecast.map(
          (
            item: { icon: string; temp: number; time: string },
            index: number
          ) => (
            <div key={index} className="text-center flex-1">
              <div className="mb-2 flex justify-center">
                {getWeatherIcon(item.icon)}
              </div>
              <p className="text-yellow-400 font-bold text-lg">
                +{item.temp}°{units}
              </p>
              <span className="text-xs opacity-80 mt-1 block">{item.time}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
