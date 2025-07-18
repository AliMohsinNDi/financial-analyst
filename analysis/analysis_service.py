from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np

app = FastAPI(title="Market Analysis Agent")

class DataPayload(BaseModel):
    ticker: str
    daily: dict  # Expected to be Alpha Vantage TIME_SERIES_DAILY_ADJUSTED JSON


def compute_ma(series: pd.Series, window: int) -> float:
    if len(series) < window:
        return series.mean()
    return series.tail(window).mean()


def compute_rsi(series: pd.Series, window: int = 14) -> float:
    delta = series.diff()
    gain = (delta.clip(lower=0)).rolling(window).mean()
    loss = (-delta.clip(upper=0)).rolling(window).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1]


def compute_volatility(series: pd.Series, window: int = 30) -> float:
    returns = series.pct_change().dropna()
    volatility = returns.rolling(window).std().iloc[-1]
    return float(volatility)


@app.post("/analysis")
async def analyze(payload: DataPayload):
    try:
        # The JSON from Alpha Vantage has date keys; convert to DataFrame
        daily_series = payload.daily.get("Time Series (Daily)")
        if daily_series is None:
            raise ValueError("Invalid daily time series data")

        df = pd.DataFrame.from_dict(daily_series, orient="index").astype(float)
        close = df["4. close"].astype(float)

        ma50 = compute_ma(close, 50)
        ma200 = compute_ma(close, 200)
        volatility = compute_volatility(close, 30)
        rsi = compute_rsi(close, 14)

        return {
            "ticker": payload.ticker.upper(),
            "ma50": ma50,
            "ma200": ma200,
            "volatility": volatility,
            "rsi": rsi,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 