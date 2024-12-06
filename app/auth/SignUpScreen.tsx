import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>fetch</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling (for reference)
const styles = StyleSheet.create({
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
    marginBottom: 20,
    color: colors.ivory,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.volt,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: colors.volt,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: colors.pine,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
  },
});
