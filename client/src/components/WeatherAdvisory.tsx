import React from 'react';
import { CloudRain, Sun, Droplets, Wind, AlertCircle, Thermometer } from 'lucide-react';

interface WeatherProps {
  locationName?: string;
}

export const WeatherAdvisory: React.FC<WeatherProps> = ({ locationName = 'Kano, Nigeria' }) => {
  const weatherData = {
    temp: '31°C',
    condition: 'Partly Cloudy with Scatter Showers',
    humidity: '68%',
    rainfallProb: '75%',
    windSpeed: '14 km/h',
    soilMoisture: 'Optimal (62%)',
    advisory: 'High rainfall expected within 48 hours. Secure harvested grains in ventilated storage and avoid applying liquid fertilizers today.',
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-lg text-emerald-100">Agricultural Weather & Soil Advisory</h3>
          </div>
          <p className="text-xs text-emerald-300/80 mt-0.5">Region: <span className="font-semibold text-amber-300">{locationName}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-800/40 px-3 py-1.5 rounded-xl border border-emerald-700/40">
          <Thermometer className="w-5 h-5 text-amber-400" />
          <span className="text-xl font-extrabold text-white">{weatherData.temp}</span>
          <span className="text-xs text-emerald-300">{weatherData.condition}</span>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 flex items-center gap-3">
          <Droplets className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="text-xs text-emerald-300/70">Humidity</div>
            <div className="text-sm font-bold text-white">{weatherData.humidity}</div>
          </div>
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 flex items-center gap-3">
          <CloudRain className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs text-emerald-300/70">Rainfall Chance</div>
            <div className="text-sm font-bold text-white">{weatherData.rainfallProb}</div>
          </div>
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 flex items-center gap-3">
          <Wind className="w-5 h-5 text-emerald-300 shrink-0" />
          <div>
            <div className="text-xs text-emerald-300/70">Wind Speed</div>
            <div className="text-sm font-bold text-white">{weatherData.windSpeed}</div>
          </div>
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 flex items-center gap-3">
          <Droplets className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs text-emerald-300/70">Soil Moisture</div>
            <div className="text-sm font-bold text-emerald-300">{weatherData.soilMoisture}</div>
          </div>
        </div>
      </div>

      {/* Advisory Alert Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3 text-amber-200 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 block mb-0.5">Agronomic Recommendation:</span>
          {weatherData.advisory}
        </div>
      </div>
    </div>
  );
};
