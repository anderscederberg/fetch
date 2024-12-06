import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Keyboard, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import colors from '@/styles/theme';
import badwords from '@/data/badwords.json';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>(''); 
  const [email, setEmail] = useState<string>('');
  
  const allFieldsFilled = username !== '' && password !== '' && email !== '';

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (event) => {
      if (event) {
        Animated.timing(translateY, {
          toValue: -event.endCoordinates.height / 2, // Adjust this value as needed
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [translateY]);

  const handleSignUp = () => {
    // Perform validation checks here
    if (!username || !password || !email) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    // Check if username contains profanity
    if (badwords.some((badword) => username.toLowerCase().includes(badword))) {
      Alert.alert('Validation Error', 'Username contains inappropriate content. Please choose another.');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    console.log('Sign up with:', username, password, email);
    // Navigate to the Main Tabs screen after sign up
    navigation.navigate('Main');
  };
  
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startSpinning = () => {
      spinValue.setValue(0); 
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 5000,
          easing: Easing.linear, 
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
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
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
        <TouchableOpacity
            style={[styles.button, !allFieldsFilled && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={!allFieldsFilled}
        >
            <Text style={[styles.buttonText, !allFieldsFilled && styles.buttonTextDisabled]}>let's go</Text>
        </TouchableOpacity>    
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.night,
    paddingBottom: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
    color: colors.ivory,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Outfit',
    color: colors.ash,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.detail,
    borderRadius: 100,
    paddingHorizontal: 20,
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
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.pine,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
  },

  buttonDisabled: {
    backgroundColor: colors.pine,
  },
  buttonTextDisabled: {
    color: colors.night,
  },
});
