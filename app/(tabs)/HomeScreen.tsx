import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/styles/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.night,
  },
});
