import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Keyboard, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import colors from '@/styles/theme';
import badwords from '@/data/badwords.json';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../fireBaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { firestore } from '../../fireBaseConfig';

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
    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
      // Always move up to a fixed height when the keyboard appears
      Animated.timing(translateY, {
        toValue: -120, // Fixed value to lift inputs above keyboard (adjust as needed)
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      // Reset to original position when the keyboard is dismissed
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
  
  const handleSignUp = async () => {
    if (!username || !password || !email) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    if (badwords.some((badword) => username.toLowerCase().includes(badword))) {
      Alert.alert('Validation Error', 'Username contains inappropriate content. Please choose another.');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase User Created:', userCredential.user);
  
      // Save additional user info in Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        username,
        email,
        createdAt: new Date(),
      });
  
      console.log('User data saved to Firestore');
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Main');
    } catch (error: any) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);
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
<View style={{ 
    flex: 1,
    backgroundColor: colors.night, 
    }}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <Animated.Image 
          source={require('../../assets/images/ball-large.png')}
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
          resizeMode="contain"
        />
        <Text 
            style={styles.title}
            onPress={() => navigation.navigate('Main')}
        >fetch</Text>
        <Text style={styles.subtitle}>create account</Text>
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor={colors.ash}
          value={username}
          onChangeText={setUsername}
        />
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
          onPress={handleSignUp}
          disabled={!allFieldsFilled}
        >
          <Text style={[styles.buttonText, !allFieldsFilled && styles.buttonTextDisabled]}>let's go</Text>
        </TouchableOpacity>
      </View>
    </View>  );
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
});
