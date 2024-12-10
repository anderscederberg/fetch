import React from 'react';
import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignUpScreen from './app/auth/SignUpScreen';
import PhotoSelectorScreen from './app/(tabs)';
import HomeScreen from './app/(tabs)/HomeScreen';
import ProfileScreen from './app/(tabs)/ProfileScreen';
import SettingsScreen from './app/(tabs)/SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import { enableScreens } from 'react-native-screens';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const ProfileStack = createNativeStackNavigator();

function ProfileStackNavigator() {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false, // Hide the header for the Profile screen
          }}
        />
        <ProfileStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false, // Hide the header for the Settings screen
            presentation: 'modal', // Makes it behave like a modal overlay
          }}
        />
      </ProfileStack.Navigator>
    );
  }

function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ 
            headerShown: false,
            tabBarShowLabel: false, 
            tabBarStyle: {
                backgroundColor: '#111111',
                height: 85,
                paddingTop: 15,
                borderTopColor: '#2f2f2f',
            },
            tabBarActiveTintColor: '#D0F019',
            tabBarInactiveTintColor: '#A2A697',
            tabBarItemStyle: {
                justifyContent: 'center',
                alignItems: 'center',
            }
        }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (<Image
            source={require('./assets/images/home.png')}
            style={{ 
                width: 22, 
                height: 22, 
                tintColor: color,
                marginRight: 14, 
            }}
          />),
        }}
      />
      <Tab.Screen
        name="Fetch"
        component={PhotoSelectorScreen}
        options={{
          tabBarLabel: 'Fetch',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./assets/images/ball.png')} 
              style={{ 
                width: size, 
                height: size, 
                tintColor: color,
            }}
            />
          ),
        }}
      />      
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('./assets/images/profile.png')}
              style= {{ 
                width: 22, 
                height: 22, 
                tintColor: color, 
                marginLeft: 14,
            }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit: require('./assets/fonts/Outfit-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    // Replace AppLoading with a simple loader
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'Sign Up', headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ 
            headerShown: false,
            gestureEnabled: false, 
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
