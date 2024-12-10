import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '@/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
const navigation = useNavigation<SettingsScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.settingsHeader}>
        <TouchableOpacity 
          style={styles.backWrapper}
          onPress={() => navigation.goBack()}
        >
        <Image 
          source={require('../../assets/images/back.png')} 
          style={styles.back}
          resizeMode="contain"
        />
        <Text style={styles.backText}>back</Text>
        </TouchableOpacity>
        <Text style={styles.settingsText}>settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.night,
    height: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.detail,
    borderRadius: 10,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: 1,
    marginBottom: 20,
    gap: 55,
    width: '90%',
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderColor: colors.detail,
  },
  settingsText: {
    color: colors.volt,
    fontFamily: 'Outfit',
    fontSize: 20,
  },
  backWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 5,
    borderColor: colors.detail,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 10,
    paddingVertical: 11,
    gap: 5,
  },
  back: {
    width: 20,
    height: 20,
  },
  backText: {
    fontFamily: 'Outfit',
    color: colors.ivory,
    fontSize: 15,
  }

});
