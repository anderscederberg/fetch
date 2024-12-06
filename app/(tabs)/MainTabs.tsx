import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen'; // Your existing HomeScreen file
import PhotoSelectorScreen from './index'; // Your existing Fetch screen
import ProfileScreen from './ProfileScreen'; // Your existing ProfileScreen file


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Fetch" component={PhotoSelectorScreen} options={{ title: 'Fetch' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
