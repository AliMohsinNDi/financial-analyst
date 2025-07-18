import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

// Cache responses for 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
if (!API_KEY) {
  console.warn('Warning: ALPHA_VANTAGE_API_KEY not set. Please set it in your .env file.');
}

async function fetchFromAlpha(functionName, params) {
  const baseUrl = 'https://www.alphavantage.co/query';
  const query = new URLSearchParams({
    function: functionName,
    apikey: API_KEY,
    ...params,
  }).toString();

  const fullUrl = `${baseUrl}?${query}`;

  // Return cached version if available
  const cached = cache.get(fullUrl);
  if (cached) return cached;

  // Otherwise fetch fresh data
  const { data } = await axios.get(fullUrl);
  cache.set(fullUrl, data);
  return data;
}

/**
 * GET /fetch?ticker=GOOG
 * Fetches intraday prices, daily time series, and news sentiment for the given ticker.
 */
app.get('/fetch', async (req, res) => {
  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: 'Missing "ticker" query parameter.' });
  }

  try {
    const [intraday, daily, news] = await Promise.all([
      fetchFromAlpha('TIME_SERIES_INTRADAY', { symbol: ticker, interval: '5min' }),
      fetchFromAlpha('TIME_SERIES_DAILY_ADJUSTED', { symbol: ticker }),
      fetchFromAlpha('NEWS_SENTIMENT', { tickers: ticker }),
    ]);

    res.json({ ticker, intraday, daily, news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Alpha Vantage.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Data Aggregator Agent listening on port ${PORT}`);
}); 