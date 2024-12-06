import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types'; // Assuming you have defined the root stack types
import colors from '@/styles/theme';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: Props) {
  const [username, setUsername] = useState<string>(''); // Type explicitly set to string
  const [password, setPassword] = useState<string>(''); // Type explicitly set to string
  const [email, setEmail] = useState<string>(''); // Type explicitly set to string

  const handleSignUp = () => {
    console.log('Sign up with:', username, password, email);
    // Navigate to the Main Tabs screen after sign up
    navigation.navigate('Main');
  };

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Function to handle the infinite spin
    const startSpinning = () => {
      spinValue.setValue(0); // Reset spinValue to 0 before starting the animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 5000, // 5000 ms for a slow spin, adjust as needed
          easing: Easing.linear, // Easing.linear makes the animation continuous and smooth
          useNativeDriver: true,
        })
      ).start();
    };

    startSpinning();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../../assets/images/ball-large.png')}
        style={[styles.logo, { transform: [{ rotate: spin }] }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>fetch</Text>
      <Text style={styles.subtitle}>create account</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        placeholderTextColor={colors.pine}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        placeholderTextColor={colors.pine}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        placeholderTextColor={colors.pine}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>let's go</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling (for reference)
const styles = StyleSheet.create({
  logo: {
    width: '30%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.night,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
    color: colors.ivory,
    top: -50,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Outfit',
    color: colors.ash,
    top: -11,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.detail,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingBottom: 2,
    marginVertical: 10,
    fontFamily: 'Outfit',
    color: colors.ivory,
  },
  button: {
    backgroundColor: colors.volt,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 100,
    width: '80%',
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.pine,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
  },
});
