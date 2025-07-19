# AI-Powered Financial Analyst

A complete end-to-end financial analysis system with live market data, quantitative analysis, recommendations, and mobile app interface.

<div style="float: right; margin-left: 20px; display: flex; flex-direction: column; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/21a92f8b-58da-47a7-b020-76ee04db58bd" width="180" />
  <img src="https://github.com/user-attachments/assets/ca8e1a2c-8cae-40d6-8d4c-e6b2e2c3ead7" width="180" />
</div>

## 🏗️ Architecture

```
financial-analyst/
├── backend/        # Node.js Data Aggregator (Port 3001)
├── analysis/       # Python FastAPI Analysis Service (Port 8001)
├── report/         # Python FastAPI Report Generation (Port 8002)
└── mobile/         # React Native Mobile App
```

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (≥18.0.0)
- **Python** (≥3.9)
- **Git**
- **Alpha Vantage API Key** (free from https://www.alphavantage.co/)
- **Expo CLI** (for mobile app)
- **Expo Go app** on your phone (iOS/Android)

## 🚀 Quick Start Guide

### 1. Clone and Setup
```bash
git clone https://github.com/Paritybitz/financial-analyst.git
cd financial-analyst
```

### 2. Get Your Alpha Vantage API Key
1. Visit https://www.alphavantage.co/
2. Click "GET FREE API KEY"
3. Sign up and copy your API key

### 3. Setup Backend Service (Node.js - Port 3001)
```bash
cd backend
copy env.sample .env          # Windows
# cp env.sample .env          # macOS/Linux

# Edit .env file and add your API key:
# ALPHA_VANTAGE_API_KEY=your_key_here

npm install
npm start
```
✅ **Test**: Visit http://localhost:3001/fetch?ticker=AAPL

### 4. Setup Analysis Service (Python - Port 8001)
```bash
cd analysis
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn analysis_service:app --reload --port 8001 --host 0.0.0.0
```
✅ **Test**: Visit http://localhost:8001/docs

### 5. Setup Report Service (Python - Port 8002)
```bash
cd report
python -m venv .venv

# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn report_service:app --reload --port 8002 --host 0.0.0.0
```
✅ **Test**: Visit http://localhost:8002/docs

### 6. Setup Mobile App (React Native)
```bash
cd mobile
npm install

# Install Expo CLI globally if you haven't:
npm install -g expo-cli

# Start the development server:
npx expo start
```

## 📱 Running the Complete System

You need **4 terminal windows** running simultaneously:

### Terminal 1 - Backend Service
```bash
cd backend
npm start
# Runs on http://localhost:3001
```

### Terminal 2 - Analysis Service
```bash
cd analysis
.\.venv\Scripts\activate    # Windows
# source .venv/bin/activate # macOS/Linux
uvicorn analysis_service:app --reload --port 8001 --host 0.0.0.0
# Runs on http://localhost:8001 (accessible from mobile via your IP)
```

### Terminal 3 - Report Service
```bash
cd report
.\.venv\Scripts\activate    # Windows
# source .venv/bin/activate # macOS/Linux
uvicorn report_service:app --reload --port 8002 --host 0.0.0.0
# Runs on http://localhost:8002 (accessible from mobile via your IP)
```

### Terminal 4 - Mobile App
```bash
cd mobile
npx expo start
# Opens Expo DevTools at http://localhost:19002
```

## 📲 Using the Mobile App

1. **Start all 4 services** as shown above
2. **Open Expo Go** app on your phone
3. **Scan the QR code** from the Expo DevTools
4. **Ensure your phone and computer are on the same Wi-Fi network**

### Mobile App Features:
- 📊 **Smart Investment Recommendations**: Clear BUY, HOLD, or AVOID advice
- 📈 **Interactive Price Charts**: Visual 30-day price trends
- 🎓 **Educational Explanations**: Understand what each metric means
- 📰 **Latest News Integration**: See how news affects stock sentiment
- 📱 **Beginner-Friendly Design**: Perfect for first-time investors

## 🛠️ API Endpoints

### Backend Service (Port 3001)
- `GET /fetch?ticker=AAPL` - Fetch live market data

### Analysis Service (Port 8001)
- `POST /analysis` - Perform technical analysis
- `GET /docs` - API documentation

### Report Service (Port 8002)
- `POST /report` - Generate reports
- `GET /docs` - API documentation

## 🔧 Configuration

### Environment Variables
Create `.env` files in the backend directory:

```env
# backend/.env
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=3001
```

### Mobile App Network Configuration
If you're getting "Network Error" on mobile:

1. Find your computer's local IP address:
   ```bash
   ipconfig          # Windows
   ifconfig          # macOS/Linux
   ```

2. Update `mobile/src/api/api.js`:
   ```javascript
   const IP_ADDRESS = '192.168.1.XXX'; // Your local IP
   ```

## 🧪 Testing the Flow

1. **Start all services** (4 terminals)
2. **Open mobile app** on your phone
3. **Enter a stock ticker** (e.g., "AAPL") or tap a popular stock
4. **Tap "🔍 Analyze Stock"** → Get instant investment recommendation
5. **View beautiful dashboard** with:
   - Clear BUY/HOLD/AVOID recommendation
   - Interactive 30-day price chart
   - Educational explanations of all metrics
   - Latest news with sentiment analysis

## 🚨 Troubleshooting

### Common Issues:

**"Network Error" on mobile:**
- Ensure phone and computer are on same Wi-Fi
- Update IP address in `mobile/src/api/api.js`
- Check all services are running
- **CRITICAL**: Python services must use `--host 0.0.0.0` flag to accept mobile connections

**"Module not found" errors:**
- Re-run `npm install` in the mobile directory
- Restart Expo with `npx expo start --clear`

**Python virtual environment issues:**
- Ensure you're in the activated virtual environment
- Re-run `pip install -r requirements.txt`

**API key errors:**
- Verify your Alpha Vantage API key is correct
- Check the `.env` file in the backend directory

### Port Conflicts:
If ports are in use, you can change them:
- Backend: Set `PORT=3002` in `.env`
- Analysis: `uvicorn analysis_service:app --port 8003 --host 0.0.0.0`
- Report: `uvicorn report_service:app --port 8004 --host 0.0.0.0`

### Python Services Not Accessible from Mobile:
If you get "Network Error" when mobile app tries to connect:
- **Always use `--host 0.0.0.0`** when starting uvicorn services
- Default `127.0.0.1` only accepts localhost connections
- Mobile apps need network-accessible services

## 📊 Sample Data Flow

```
Mobile App → Backend (3001) → Alpha Vantage API
     ↓
Analysis Service (8001) → Technical Analysis
     ↓
Report Service (8002) → Report Generation
     ↓
Mobile App → Display Results
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all services
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with:** Node.js, Python FastAPI, React Native, Expo, Alpha Vantage API



---

## 🏗️ **Architecture & Design Questions**

### "Why did you choose a microservices architecture?"
**Answer:**
- **Separation of concerns**: Data fetching, analysis, and presentation are separate
- **Scalability**: Each service can be scaled independently  
- **Technology flexibility**: Node.js for I/O-heavy backend, Python for data analysis
- **Fault tolerance**: If one service fails, others continue working

### "Explain the data flow in your application"
**Answer:**
1. Mobile app sends ticker symbol to Node.js backend (port 3001)
2. Backend fetches data from Alpha Vantage API with caching
3. Backend forwards data to Python analysis service (port 8001)
4. Analysis service calculates technical indicators (RSI, moving averages)
5. Results return to mobile app for display with recommendations

---

## 📱 **Mobile Development Questions**

### "Why React Native over native iOS/Android?"
**Answer:**
- **Cross-platform**: One codebase for iOS and Android
- **Faster development**: Shared business logic and UI components
- **Hot reload**: Faster development cycle with Expo
- **Cost-effective**: Single development team vs separate iOS/Android teams

### "How do you handle network requests in React Native?"
**Answer:**
- **Axios** for HTTP requests with proper error handling
- **Network configuration**: Using local IP addresses for development
- **State management**: useState for loading states and error handling
- **User feedback**: Loading indicators and error messages

---

## 🌐 **Backend Development Questions**

### "How do you handle API rate limits?"
**Answer:**
- **Caching**: NodeCache with 5-minute TTL to reduce API calls
- **Rate limiting awareness**: Alpha Vantage allows 5 calls/minute, 500/day
- **Demo mode**: Fallback to demo data when limits are hit
- **Error handling**: Graceful degradation with user-friendly messages

### "Explain your caching strategy"
**Answer:**
```javascript
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const cached = cache.get(fullUrl);
if (cached) return cached;
// Fetch fresh data and cache it
cache.set(fullUrl, data);
```

---

## 🐍 **Python/Data Analysis Questions**

### "How do you calculate technical indicators?"
**Answer:**
- **Moving Averages**: `series.tail(window).mean()` for MA50/MA200
- **RSI**: Delta calculation with gain/loss ratios over 14-day window
- **Volatility**: Standard deviation of price returns over 30 days
- **Pandas**: Used for time series data manipulation and analysis

### "How do you generate investment recommendations?"
**Answer:**
```python
# Scoring system
if ma50 > ma200: score += 2  # Upward trend
if rsi < 30: score += 2      # Oversold (buy opportunity)
if rsi > 70: score -= 2      # Overbought (avoid)
if volatility < 0.02: score += 1  # Low risk

# Recommendations: BUY (score >= 3), HOLD (0-2), AVOID (<0)
```

---

## 🔧 **DevOps & Deployment Questions**

### "How would you deploy this to production?"
**Answer:**
- **Backend**: Docker containers on AWS ECS or Google Cloud Run
- **Mobile**: Expo EAS Build for app store deployment
- **Database**: Add PostgreSQL for caching and user data
- **Load balancing**: NGINX for backend services
- **Monitoring**: Application logging and health checks

### "How do you handle different environments?"
**Answer:**
- **Environment variables**: `.env` files for API keys and configs
- **Mobile config**: Different API endpoints for dev/staging/prod
- **Service discovery**: Environment-specific service URLs

---

## 📊 **Data & API Questions**

### "Why Alpha Vantage over other financial APIs?"
**Answer:**
- **Comprehensive**: Stock prices, technical indicators, news sentiment
- **Free tier**: Good for MVP and development
- **Reliability**: Well-established financial data provider
- **Documentation**: Clear API documentation and examples

### "How do you handle API failures?"
**Answer:**
- **Try-catch blocks**: Proper error handling in all API calls
- **User feedback**: Clear error messages ("Unable to analyze this stock")
- **Fallback**: Demo data when API limits are hit
- **Retry logic**: Could implement exponential backoff for transient failures

---

## 🎨 **UI/UX Questions**

### "How did you make complex financial data beginner-friendly?"
**Answer:**
- **Plain English**: "Stock may be overbought" vs "RSI > 70"
- **Visual indicators**: ✅❌⚠️ for quick understanding
- **Educational explanations**: What each metric means and why it matters
- **Clear recommendations**: Simple BUY/HOLD/AVOID with reasoning
- **Progressive disclosure**: Most important info first, details below

---

## 🚀 **Performance & Optimization Questions**

### "How do you optimize mobile app performance?"
**Answer:**
- **Efficient rendering**: FlatList for large datasets (if needed)
- **Image optimization**: Proper sizing and caching
- **Network optimization**: Minimize API calls with caching
- **Bundle optimization**: Code splitting and tree shaking with Expo

### "How would you scale this application?"
**Answer:**
- **Horizontal scaling**: Multiple instances of each service
- **Database**: Add persistent storage for user preferences and cache
- **CDN**: For static assets and API response caching
- **Queue system**: Redis for background processing of analysis

---

## 🔍 **Code Quality Questions**

### "How do you ensure code quality?"
**Answer:**
- **Error handling**: Comprehensive try-catch blocks
- **Type safety**: Could add TypeScript for better type checking
- **Code organization**: Modular structure with separate concerns
- **Documentation**: Clear README with setup instructions

---

## 💡 **Improvement Questions**

### "What would you add next?"
**Answer:**
- **User accounts**: Save favorite stocks and analysis history
- **Real-time updates**: WebSocket connections for live prices
- **Portfolio tracking**: Track multiple stocks and performance
- **More indicators**: MACD, Bollinger Bands, Fibonacci retracements
- **Backtesting**: Historical performance of recommendations

---

## 🎯 **Key Interview Tips**

### **Always Relate Technical Decisions to Business Value:**
- "I chose React Native because it reduces development time and cost while reaching both iOS and Android users"
- "The microservices architecture allows us to scale the analysis engine independently as user demand grows"
- "Caching reduces API costs and improves user experience with faster response times"

### **Be Prepared to Discuss Trade-offs:**
- **React Native**: Faster development vs some performance limitations
- **Microservices**: Better scalability vs increased complexity
- **Alpha Vantage**: Free tier vs rate limits

### **Show Growth Mindset:**
- Acknowledge areas for improvement (TypeScript, testing, monitoring)
- Discuss how you'd evolve the architecture for scale
- Mention lessons learned during development

### **Technical Deep Dives You Should Know:**
- How RSI calculation works mathematically
- Why moving average crossovers indicate trends
- HTTP status codes and error handling patterns
- React Native component lifecycle
- Python pandas operations for time series

### **Demo Preparation:**
- Be ready to walk through the app live
- Explain the user journey from ticker entry to recommendation
- Show how you handle edge cases (invalid tickers, network errors)
- Demonstrate the educational aspects that help beginners

---

**Remember**: Confidence comes from understanding not just what you built, but **why** you built it that way and **how** you'd improve it! 🚀
