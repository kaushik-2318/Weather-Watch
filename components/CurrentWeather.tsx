"use client";

import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { WbSunny, Cloud } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

type Weather = {
  date: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  sunrise: string;
  sunset: string;
};

type ForecastItem = {
  time: string;
  temp: number;
};

type Props = {
  weather: Weather;
  forecast: ForecastItem[];
  units: string;
};

export default function CurrentWeather({ weather, forecast, units }: Props) {
  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "sunny":
      case "clear":
        return (
          <WbSunny className="text-yellow-400" style={{ fontSize: "2.5rem" }} />
        );
      case "cloudy":
      case "partly cloudy":
      default:
        return <Cloud className="text-white" style={{ fontSize: "2.5rem" }} />;
    }
  };

  if (!weather) return null;

  const chartData = {
    labels: forecast?.slice(0, 8).map((item) => item.time) || [],
    datasets: [
      {
        fill: true,
        label: "Temperature",
        data: forecast?.slice(0, 8).map((item) => item.temp) || [],
        borderColor: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "white",
        pointBorderColor: "white",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    elements: { point: { radius: 0 } },
  };

  return (
    <div className="text-white">
      <h2 className="text-xl mb-2">{weather.date}</h2>

      <div className="flex items-start gap-3">
        {getWeatherIcon(weather.condition)}
        <h1 className="text-6xl font-bold text-yellow-400">
          +{weather.temperature}°{units}
        </h1>
      </div>

      <p className="mt-1 text-lg">Feels like {weather.feelsLike}°</p>
      <p className="mt-1 text-sm opacity-90 max-w-md">{weather.description}</p>

      <div className="flex gap-6 mt-2">
        <p className="text-sm opacity-70">Sunrise: {weather.sunrise}</p>
        <p className="text-sm opacity-70">Sunset: {weather.sunset}</p>
      </div>

      <div className="h-24 mt-4 hidden md:block">
        <Chart type="line" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
