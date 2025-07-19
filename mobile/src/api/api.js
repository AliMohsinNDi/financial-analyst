import axios from 'axios';

// ---==> IMPORTANT: Replace 'localhost' with your computer's IP address <==---
const IP_ADDRESS = '192.168.1.116'; // <--- This is your correct local IP

const API_BASE_URL = `http://${IP_ADDRESS}:3001`; // Node.js backend
const ANALYSIS_URL = `http://${IP_ADDRESS}:8001/analysis`; // Python analysis
const REPORT_URL = `http://${IP_ADDRESS}:8002/report`; // Python report

/**
 * Fetches all base data for a given stock ticker.
 * @param {string} ticker The stock symbol (e.g., "GOOG").
 * @returns {Promise<object>} The combined data from the aggregator service.
 */
export const fetchBaseData = async (ticker) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetch?ticker=${ticker}`);
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
export const fetchAnalysis = async (data) => {
  try {
    const response = await axios.post(ANALYSIS_URL, data);
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

export const fetchReport = async (data) => {
  try {
    const response = await axios.post(REPORT_URL, data, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}; 