import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const route = useRoute();
  const { ticker, baseData, analysis } = route.params;

  // Generate chart data from daily prices
  const generateChartData = () => {
    const dailyData = baseData.daily["Time Series (Daily)"];
    const dates = Object.keys(dailyData).slice(0, 20).reverse(); // Last 20 days for better readability
    const prices = dates.map(date => parseFloat(dailyData[date]["4. close"]));
    
    return {
      labels: dates.map((date, index) => index % 4 === 0 ? date.slice(5, 10) : ''), // Show every 4th label
      datasets: [{
        data: prices,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green line
        strokeWidth: 3
      }]
    };
  };

  // Investment recommendation logic
  const getRecommendation = () => {
    const { ma50, ma200, rsi, volatility } = analysis;
    let score = 0;
    let reasons = [];

    // Moving average analysis
    if (ma50 > ma200) {
      score += 2;
      reasons.push("✅ Price trending upward (50-day above 200-day average)");
    } else {
      score -= 1;
      reasons.push("⚠️ Price trending downward (50-day below 200-day average)");
    }

    // RSI analysis
    if (rsi < 30) {
      score += 2;
      reasons.push("✅ Stock may be oversold (good buying opportunity)");
    } else if (rsi > 70) {
      score -= 2;
      reasons.push("❌ Stock may be overbought (consider waiting)");
    } else {
      score += 1;
      reasons.push("✅ RSI in healthy range");
    }

    // Volatility analysis
    if (volatility < 0.02) {
      score += 1;
      reasons.push("✅ Low volatility (stable stock)");
    } else if (volatility > 0.05) {
      score -= 1;
      reasons.push("⚠️ High volatility (risky stock)");
    }

    if (score >= 3) return { recommendation: "BUY", color: "#4CAF50", reasons };
    if (score >= 0) return { recommendation: "HOLD", color: "#FF9800", reasons };
    return { recommendation: "AVOID", color: "#F44336", reasons };
  };

  const recommendation = getRecommendation();
  const chartData = generateChartData();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stockSymbol}>{ticker.toUpperCase()}</Text>
        <Text style={styles.stockName}>Stock Analysis</Text>
      </View>

      {/* Recommendation Card */}
      <View style={[styles.card, styles.recommendationCard]}>
        <Text style={styles.cardTitle}>💡 Investment Recommendation</Text>
        <View style={styles.recommendationBadge}>
          <Text style={[styles.recommendationText, { color: recommendation.color }]}>
            {recommendation.recommendation}
          </Text>
        </View>
        <Text style={styles.recommendationSubtext}>
          Based on technical analysis of recent price movements
        </Text>
      </View>

      {/* Price Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 20-Day Price Trend</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={width - 80}
            height={220}
            chartConfig={{
              backgroundColor: '#1a1a1a',
              backgroundGradientFrom: '#1a1a1a',
              backgroundGradientTo: '#1a1a1a',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: "#4CAF50"
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: "#333",
                strokeWidth: 1
              },
              paddingRight: 40,
              paddingLeft: 20
            }}
            bezier
            style={styles.chart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withDots={true}
            withShadow={false}
            withScrollableDot={false}
          />
        </View>
      </View>

      {/* Key Metrics Explained */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Key Metrics Explained</Text>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>Moving Averages</Text>
            <Text style={styles.metricValue}>
              50-day: ${analysis.ma50?.toFixed(2)} | 200-day: ${analysis.ma200?.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.metricExplanation}>
            Average price over time. When 50-day is above 200-day, it suggests an upward trend.
          </Text>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>RSI (Relative Strength)</Text>
            <Text style={styles.metricValue}>{analysis.rsi?.toFixed(1)}</Text>
          </View>
                     <Text style={styles.metricExplanation}>
             Measures if stock is overbought (&gt;70) or oversold (&lt;30). Values between 30-70 are healthy.
           </Text>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>Volatility</Text>
            <Text style={styles.metricValue}>{(analysis.volatility * 100)?.toFixed(1)}%</Text>
          </View>
          <Text style={styles.metricExplanation}>
            How much the price swings. Lower volatility means more stable, higher means more risky.
          </Text>
        </View>
      </View>

      {/* Analysis Reasoning */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤔 Why This Recommendation?</Text>
        {recommendation.reasons.map((reason, index) => (
          <Text key={index} style={styles.reasonText}>{reason}</Text>
        ))}
      </View>

      {/* Latest News */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📰 Recent News</Text>
        {baseData.news?.feed?.slice(0, 2).map((article, index) => (
          <View key={index} style={styles.newsItem}>
            <Text style={styles.newsTitle}>{article.title}</Text>
            <Text style={styles.newsSummary} numberOfLines={2}>
              {article.summary || 'No summary available'}
            </Text>
            <View style={styles.sentimentBadge}>
              <Text style={[styles.sentimentText, {
                color: article.overall_sentiment_score > 0.15 ? '#4CAF50' : 
                      article.overall_sentiment_score < -0.15 ? '#F44336' : '#FF9800'
              }]}>
                {article.overall_sentiment_label || 'Neutral'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerText}>
          ⚠️ This is for educational purposes only. Always do your own research and consult with financial advisors before making investment decisions.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  stockSymbol: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 2,
  },
  stockName: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  recommendationCard: {
    backgroundColor: '#1a2f1a',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  recommendationBadge: {
    alignSelf: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommendationSubtext: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
    overflow: 'hidden',
    borderRadius: 16,
  },
  chart: {
    borderRadius: 16,
  },
  metricItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  metricExplanation: {
    fontSize: 14,
    color: '#bbb',
    lineHeight: 20,
  },
  reasonText: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 8,
    lineHeight: 20,
  },
  newsItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
  },
  newsSummary: {
    fontSize: 12,
    color: '#bbb',
    lineHeight: 16,
    marginBottom: 8,
  },
  sentimentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  disclaimerCard: {
    backgroundColor: '#2a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#ccc',
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default DashboardScreen; 