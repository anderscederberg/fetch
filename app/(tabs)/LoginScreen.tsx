import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Keyboard, Alert, } from 'react-native';
import { StackNavigationProp, } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../fireBaseConfig';
import colors from '@/styles/theme';
import { StackActions } from '@react-navigation/native';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const allFieldsFilled = email !== '' && password !== '';

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [translateY]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        console.log("User succesfully logged in:", user.uid);
        Alert.alert('saaaaafe');
  
        setTimeout(() => {
          console.log("Navigating to 'Main'...");
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }, 500);
      } else {
        Alert.alert('fuck')
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
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
    <View style={{ flex: 1, backgroundColor: colors.night }}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <Animated.Image
          source={require('../../assets/images/ball-large.png')}
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
          resizeMode="contain"
        />
        <Text style={styles.title}>fetch</Text>
        <Text style={styles.subtitle}>log in</Text>
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor={colors.ash}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor={colors.ash}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !allFieldsFilled && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!allFieldsFilled || isLoading}
        >
          <Text style={[styles.buttonText, !allFieldsFilled && styles.buttonTextDisabled]}>
            {isLoading ? 'Logging in...' : "let's go"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.signUpLink}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    color: colors.ivory,
    marginBottom: 11,
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  button: {
    backgroundColor: colors.volt,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 100,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.pine,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
  },
  buttonDisabled: {
    backgroundColor: colors.detail,
  },
  buttonTextDisabled: {
    color: colors.night,
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: colors.ivory,
    fontFamily: 'Outfit',
    fontSize: 14,
  },
});