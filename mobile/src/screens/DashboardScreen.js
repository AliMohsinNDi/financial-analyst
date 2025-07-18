import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as api from '../api/api';

const DashboardScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticker, baseData, analysis } = route.params;

  const [loadingReport, setLoadingReport] = useState(false);

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const pdfUri = await api.generateReport(ticker, analysis, baseData.daily);
      navigation.navigate('Report', { uri: pdfUri });
    } catch (error) {
      console.error('Failed to generate report:', error);
      // Optionally, show an alert to the user
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{ticker.toUpperCase()} Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key Metrics</Text>
        {Object.entries(analysis).map(([key, value]) => (
          <Text key={key} style={styles.metricText}>
            {key.replace(/_/g, ' ').toUpperCase()}: {typeof value === 'number' ? value.toFixed(2) : value}
          </Text>
        ))}
      </View>
      
      {loadingReport ? (
         <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <Button title="Generate PDF Report" onPress={handleGenerateReport} color="#841584" />
      )}

      {/* Raw data for debugging - can be removed later */}
      <View style={{ marginTop: 20 }}>
        <Text style={{color: "white"}}>{JSON.stringify(baseData.news, null, 2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  metricText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
});

export default DashboardScreen; 