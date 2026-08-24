let cache = { data: null, fetchedAt: 0 };
const ONE_HOUR = 60 * 60 * 1000;

const getForecast = async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.fetchedAt < ONE_HOUR) {
      return res.status(200).json(cache.data);
    }

    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=28.5384&longitude=-81.3789'
      + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
      + '&temperature_unit=fahrenheit&timezone=America/New_York&forecast_days=5';

    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather service unavailable.');

    const raw = await response.json();

    const days = raw.daily.time.map((date, i) => ({
      date,
      code: raw.daily.weather_code[i],
      high: Math.round(raw.daily.temperature_2m_max[i]),
      low: Math.round(raw.daily.temperature_2m_min[i]),
      rain: raw.daily.precipitation_probability_max[i]
    }));

    cache = { data: days, fetchedAt: Date.now() };
    res.status(200).json(days);
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: 'Could not load forecast.' });
  }
};

module.exports = { getForecast };
