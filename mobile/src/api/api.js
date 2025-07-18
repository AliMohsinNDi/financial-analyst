import axios from 'axios';

const AGGREGATOR_URL = 'http://localhost:3001';
const ANALYSIS_URL = 'http://localhost:8001';
const REPORT_URL = 'http://localhost:8002';

/**
 * Fetches all base data for a given stock ticker.
 * @param {string} ticker The stock symbol (e.g., "GOOG").
 * @returns {Promise<object>} The combined data from the aggregator service.
 */
export const fetchBaseData = async (ticker) => {
  try {
    const response = await axios.get(`${AGGREGATOR_URL}/fetch`, { params: { ticker } });
    return response.data;
  } catch (error) {
    console.error('Error fetching base data:', error);
    throw error;
  }
};

/**
 * Sends daily data to the analysis service.
 * @param {string} ticker The stock symbol.
 * @param {object} dailyData The daily time series data.
 * @returns {Promise<object>} The analysis results.
 */
export const fetchAnalysis = async (ticker, dailyData) => {
  try {
    const response = await axios.post(`${ANALYSIS_URL}/analysis`, {
      ticker,
      daily: dailyData,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};

/**
 * Requests a PDF report from the report generation service.
 * @param {string} ticker The stock symbol.
 * @param {object} analysis The analysis data.
 * @param {object} dailyData The daily time series data.
 * @returns {Promise<string>} The path to the downloaded PDF file.
 */
export const generateReport = async (ticker, analysis, dailyData) => {
  try {
    const response = await axios.post(
      `${REPORT_URL}/report`,
      { ticker, analysis, daily: dailyData },
      { responseType: 'blob' } // Important for handling binary file data
    );
    
    // In a real mobile app, you would use a file system library
    // to save the blob and get a URI. For now, we'll return a blob URL.
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    return fileURL; // This URL can be used as the source for a PDF viewer
    
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}; 