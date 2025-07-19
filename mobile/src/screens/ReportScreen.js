import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getReport } from '../api/api';

const ReportScreen = ({ route }) => {
  const { ticker, analysis, daily } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateAndShareReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pdfBlob = await getReport({ ticker, analysis, daily });
      
      const fileUri = `${FileSystem.documentDirectory}${ticker}-report.pdf`;

      // On web, we can just open the blob in a new tab.
      if (Platform.OS === 'web') {
        const url = URL.createObjectURL(pdfBlob);
        window.open(url);
        setIsLoading(false);
        return;
      }
      
      // On mobile, we need to save the file first.
      // The API returns a blob, so we need a FileReader to convert it to base64.
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (!(await Sharing.isAvailableAsync())) {
          alert(`Sharing is not available on your platform`);
          return;
        }
        await Sharing.shareAsync(fileUri);
      };
      reader.onerror = (e) => {
        setError('Failed to read PDF data.');
        console.error(e);
      };
      reader.readAsDataURL(pdfBlob);

    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Report for {ticker}</Text>
      <Text style={styles.subtitle}>Click the button below to generate and view your PDF report.</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <Button 
          title="Generate and Share Report" 
          onPress={handleGenerateAndShareReport} 
          color="#841584"
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default ReportScreen; 