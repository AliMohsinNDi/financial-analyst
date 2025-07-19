import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as api from '../api/api';

const HomeScreen = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

  const handleFetchData = async (stockTicker = ticker) => {
    if (!stockTicker.trim()) {
      setError('Please enter a stock ticker symbol');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Fetch base data (intraday, daily, news)
      const baseData = await api.fetchBaseData(stockTicker.toUpperCase());
      
      // 2. Fetch analysis using the daily data
      const analysisData = {
        ticker: stockTicker.toUpperCase(),
        daily: baseData.daily
      };
      const analysis = await api.fetchAnalysis(analysisData);

      // 3. Navigate to Dashboard with all data
      navigation.navigate('Dashboard', {
        ticker: stockTicker.toUpperCase(),
        baseData,
        analysis,
      });

    } catch (err) {
      setError('Unable to analyze this stock. Please check the ticker symbol and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (stockTicker) => {
    setTicker(stockTicker);
    handleFetchData(stockTicker);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📈 Smart Stock Analyzer</Text>
        <Text style={styles.subtitle}>
          Get easy-to-understand investment advice for any stock
        </Text>
      </View>

      {/* How it works */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🤔 How it works</Text>
        <Text style={styles.infoText}>
          1. Enter a stock ticker symbol (like AAPL for Apple)
        </Text>
        <Text style={styles.infoText}>
          2. We analyze recent price movements and trends
        </Text>
        <Text style={styles.infoText}>
          3. Get a simple BUY, HOLD, or AVOID recommendation
        </Text>
        <Text style={styles.infoText}>
          4. Understand WHY with clear explanations
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Enter Stock Ticker Symbol</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., AAPL, GOOGL, TSLA"
          placeholderTextColor="#888"
          value={ticker}
          onChangeText={(text) => {
            setTicker(text.toUpperCase());
            setError(null);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={10}
        />
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity 
          style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]} 
          onPress={() => handleFetchData()}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>Analyzing...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>🔍 Analyze Stock</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Popular Stocks */}
      <View style={styles.popularCard}>
        <Text style={styles.popularTitle}>📊 Popular Stocks to Try</Text>
        <Text style={styles.popularSubtitle}>Tap any stock to analyze instantly</Text>
        
        <View style={styles.stockGrid}>
          {popularStocks.map((stock) => (
            <TouchableOpacity
              key={stock}
              style={styles.stockChip}
              onPress={() => handleQuickSelect(stock)}
              disabled={loading}
            >
              <Text style={styles.stockChipText}>{stock}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Educational Note */}
      <View style={styles.educationCard}>
        <Text style={styles.educationTitle}>💡 What you'll learn</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Whether the stock is trending up or down</Text>
          <Text style={styles.featureItem}>• If it's a good time to buy or wait</Text>
          <Text style={styles.featureItem}>• How risky the investment might be</Text>
          <Text style={styles.featureItem}>• Latest news affecting the stock</Text>
          <Text style={styles.featureItem}>• Simple explanations of complex metrics</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerText}>
          This app provides educational analysis only. Always do your own research and consider consulting a financial advisor before making investment decisions.
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
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 8,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  popularCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  popularSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stockChip: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  stockChipText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  educationCard: {
    backgroundColor: '#1a1a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 20,
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

export default HomeScreen; 