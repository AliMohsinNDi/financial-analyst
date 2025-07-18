import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as api from '../api/api';

const HomeScreen = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleFetchData = async () => {
    if (!ticker.trim()) {
      setError('Ticker symbol cannot be empty.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch base data (intraday, daily, news)
      const baseData = await api.fetchBaseData(ticker);
      
      // 2. Fetch analysis using the daily data
      const analysis = await api.fetchAnalysis(ticker, baseData.daily);

      // 3. Navigate to Dashboard with all data
      navigation.navigate('Dashboard', {
        ticker,
        baseData,
        analysis,
      });

    } catch (err) {
      setError('Failed to fetch data. Please check the ticker and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Financial Analyst</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Stock Ticker (e.g., GOOG)"
        value={ticker}
        onChangeText={setTicker}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <Button title="Fetch Analysis" onPress={handleFetchData} color="#841584" />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 18,
    color: 'white',
    backgroundColor: '#333',
  },
  errorText: {
    marginTop: 15,
    color: 'red',
    fontSize: 16,
  },
});

export default HomeScreen; 