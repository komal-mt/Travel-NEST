import { useEffect, useState } from 'react'
import { FiWind, FiDroplet, FiThermometer } from 'react-icons/fi'

export default function WeatherCard({ city }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
        )

        const data = await res.json()

        setWeather(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (city) fetchWeather()
  }, [city])

  if (loading) {
    return (
      <div className="card p-6">
        <p className="text-slate-400">Loading weather...</p>
      </div>
    )
  }

  if (!weather || weather.cod !== 200) return null

  return (
    <div className="card p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-2xl font-bold">{weather.name}</h3>
          <p className="capitalize text-white/80">
            {weather.weather[0].description}
          </p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt=""
          className="w-20 h-20"
        />
      </div>

      <div className="text-5xl font-bold mb-5">
        {Math.round(weather.main.temp)}°C
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <FiThermometer className="mx-auto mb-1" />
          Feels Like
          <div className="font-bold">
            {Math.round(weather.main.feels_like)}°C
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 text-center">
          <FiDroplet className="mx-auto mb-1" />
          Humidity
          <div className="font-bold">
            {weather.main.humidity}%
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 text-center">
          <FiWind className="mx-auto mb-1" />
          Wind
          <div className="font-bold">
            {weather.wind.speed} km/h
          </div>
        </div>
      </div>
    </div>
  )
}