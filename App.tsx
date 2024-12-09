import React from 'react';
import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignUpScreen from './app/auth/SignUpScreen';
import PhotoSelectorScreen from './app/(tabs)';
import HomeScreen from './app/(tabs)/HomeScreen';
import ProfileScreen from './app/(tabs)/ProfileScreen';
import SettingsScreen from './app/(tabs)/SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#111111',
                borderBottomWidth: 1,
                borderBottomColor: '#1f1f1f',
                height: 111,
            },
            headerShown: false,
            
        }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'you',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon name="settings" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
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
                height: 95,
                paddingTop: 15,
                borderTopColor: '#1f1f1f',
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
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
