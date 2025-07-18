import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';

const ReportScreen = () => {
    const route = useRoute();
    const { uri } = route.params;

    if (!uri) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No PDF URI provided.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pdf
                source={{ uri }}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
                activityIndicator={<ActivityIndicator size="large" color="#00ff00" />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: '#121212',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    }
});

export default ReportScreen; 