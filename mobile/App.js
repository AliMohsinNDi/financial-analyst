import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ReportScreen from './src/screens/ReportScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1e1e1e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AI Financial Analyst' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={({ route }) => ({ title: `${route.params.ticker} Dashboard` })}/>
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'Financial Report' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
