"use client";

import { CloudRain, Sun, Cloud } from "lucide-react";

export default function WeatherWidget({ config }: { config: any }) {
  // In a real scenario, you'd use SWR to fetch from /api/widgets/weather?city=X
  // For this blueprint, we simulate a hardcoded weather.
  const city = config?.city || "São Paulo";
  const temp = config?.temp || "22°C";
  const condition = config?.condition || "Chuvoso";

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
      <div className="flex items-center gap-3">
        {condition === "Chuvoso" ? (
          <CloudRain className="w-8 h-8 text-blue-400" />
        ) : condition === "Ensolarado" ? (
          <Sun className="w-8 h-8 text-yellow-400" />
        ) : (
          <Cloud className="w-8 h-8 text-gray-400" />
        )}
        <div>
          <p className="font-semibold text-sm">{city}</p>
          <p className="text-xs text-white/60">{condition}</p>
        </div>
      </div>
      <div className="text-xl font-bold">{temp}</div>
    </div>
  );
}
