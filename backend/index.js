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
      fetchFromAlpha('TIME_SERIES_DAILY', { symbol: ticker }), // Use basic daily instead of adjusted
      fetchFromAlpha('NEWS_SENTIMENT', { tickers: ticker }),
    ]);

    res.json({ ticker, intraday, daily, news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Alpha Vantage.' });
  }
});

/**
 * GET /fetch/demo?ticker=GOOG
 * Returns demo data for testing when API limits are hit
 */
app.get('/fetch/demo', async (req, res) => {
  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: 'Missing "ticker" query parameter.' });
  }

  // Demo data structure matching Alpha Vantage format
  const demoData = {
    ticker: ticker.toUpperCase(),
    intraday: {
      "Meta Data": {
        "1. Information": "Intraday (5min) open, high, low, close prices and volume",
        "2. Symbol": ticker.toUpperCase(),
        "3. Last Refreshed": new Date().toISOString().slice(0, 19),
        "4. Interval": "5min"
      },
      "Time Series (5min)": {
        [new Date().toISOString().slice(0, 16) + ":00"]: {
          "1. open": "150.00",
          "2. high": "152.50",
          "3. low": "149.75",
          "4. close": "151.25",
          "5. volume": "1000000"
        }
      }
    },
    daily: {
      "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": ticker.toUpperCase(),
        "3. Last Refreshed": new Date().toISOString().slice(0, 10)
      },
      "Time Series (Daily)": {
        "2024-01-15": { "1. open": "148.50", "2. high": "152.00", "3. low": "147.25", "4. close": "151.25", "5. volume": "25000000" },
        "2024-01-14": { "1. open": "145.00", "2. high": "149.50", "3. low": "144.75", "4. close": "148.50", "5. volume": "22000000" },
        "2024-01-13": { "1. open": "142.00", "2. high": "146.00", "3. low": "141.50", "4. close": "145.00", "5. volume": "28000000" },
        "2024-01-12": { "1. open": "140.25", "2. high": "143.75", "3. low": "139.50", "4. close": "142.00", "5. volume": "30000000" },
        "2024-01-11": { "1. open": "138.00", "2. high": "141.50", "3. low": "137.25", "4. close": "140.25", "5. volume": "26000000" }
      }
    },
    news: {
      "items": "50",
      "sentiment_score_definition": "x <= -0.35: Bearish; -0.35 < x <= -0.15: Somewhat-Bearish; -0.15 < x < 0.15: Neutral; 0.15 <= x < 0.35: Somewhat_Bullish; x >= 0.35: Bullish",
      "relevance_score_definition": "0 < x <= 1, with a higher score indicating higher relevance.",
      "feed": [
        {
          "title": `${ticker.toUpperCase()} Demo News: Strong Performance Expected`,
          "summary": "Demo news article for testing purposes.",
          "overall_sentiment_score": 0.25,
          "overall_sentiment_label": "Somewhat-Bullish"
        }
      ]
    }
  };

  res.json(demoData);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Data Aggregator Agent listening on port ${PORT}`);
}); 