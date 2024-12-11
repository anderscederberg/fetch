import colors from '@/styles/theme';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth, firestore } from '../../fireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {

    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [location, setLocation] = useState<string | null>('Fetching location...');
    
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    const [username, setUsername] = useState<string>('Fetching username...');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('let me see your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation('Location permission denied.');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync({});
            const [place] = await Location.reverseGeocodeAsync(coords);
            setLocation(`${place.city}, ${place.region}`);
        };

        fetchLocation();
    }, []);

    useEffect(() => {
      const fetchUsername = async () => {
          try {
              const user = auth.currentUser;

              if (!user) {
                  Alert.alert('Error', 'No user logged in.');
                  return;
              }

              const userDocRef = doc(firestore, 'users', user.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                  const userData = userDoc.data();
                  setUsername(userData.username || 'No username');
              } else {
                  Alert.alert('Error', 'User data not found.');
              }
          } catch (error) {
              console.error('Error fetching username:', error);
              Alert.alert('Error', 'Failed to fetch username.');
          }
      };

      fetchUsername();
    }, []);

  return (
    <View style={styles.container}>
        <View style={styles.profileHeader}>
            <Text style={styles.fetchText}>fetch</Text>
            <Text style={styles.youText}>you</Text>
            <TouchableOpacity 
                // style={styles.settingsWrapper}
                onPress={() => navigation.navigate('Settings')}
            >
                <Image 
                    source={require('../../assets/images/settings.png')} 
                    style={styles.settings}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
        <View style={styles.profileMain}>
            <View style={styles.profileWrapper}>
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                <Text style={styles.placeholder}>+</Text>
                )}
                </TouchableOpacity>
                <View style={styles.profileInfoContainer}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username}>{username}</Text>
                        <Image source={require('../../assets/images/verified.png')} style={styles.verifiedIcon} />
                    </View>
                    <View style={styles.locationContainer}>
                        <Image
                            source={require('../../assets/images/location.png')}
                            style={styles.locationIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.locationText}>{location}</Text>
                    </View>
                    <Text style={styles.bio}>put that on everything i luv</Text>
                    {/* <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.edit}>
                            <Text style={styles.editText}>edit profile</Text>
                        </TouchableOpacity> */}
                        {/* <TouchableOpacity>
                            <Text>follow</Text>
                        </TouchableOpacity> */}

                    {/* </View> */}
                </View>
            </View>
            <View style={styles.profileNumbers}>
                <Text style={styles.numbersText}>collections: 11</Text>
                <TouchableOpacity style={styles.following}>
                    <Text style={styles.numbersText}>following: 111</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followers}>
                    <Text style={styles.numbersText}>followers: 420</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.night,
    height: '100%',
    paddingTop: 65,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    paddingVertical: 11,
    paddingHorizontal: 25,
    borderRadius: 100,
    borderColor: colors.detail,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fetchText: {
    color: colors.ivory,
    fontFamily: 'Outfit',
    fontSize: 30,
    fontWeight: 'bold',
  },
  settings: {
    width: 25,
    height: 25,
    margin: 0,
    padding: 0,
  },

  // settingsWrapper: {
  //   borderWidth: 1,
  //   padding: 5,
  //   borderColor: colors.detail,
  //   borderRadius: 100,
  // },
  youText: {
    color: colors.volt,
    fontFamily: 'Outfit',
    fontSize: 20,
    marginRight: 45,
  },
  profileMain: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    // borderWidth: 1,
    borderColor: colors.detail,
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 11,
    borderRadius: 11,
  },
  profileWrapper: {
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    gap: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
  profileInfoContainer: {
    flexDirection: 'column',
    // borderWidth: 1,
    gap: 11,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 5,
  },
  usernameContainer: {
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
  },
  username: {
    color: colors.ivory,
    fontFamily: 'Outfit',
    fontSize: 25,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    padding: 0,
    margin: 0,
  },
  locationIcon: {
    width: 15,
    height: 15,
  },
  locationText: {
    color: colors.ash,
    fontFamily: 'Outfit',
  },
  bio: {
    color: colors.ivory,
    fontFamily: 'Outfit',
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  edit: {
    borderWidth: 1,
    borderColor: colors.detail,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 6,

  },
  editText: {
    color: colors.ivory,
    margin: 0,
    fontFamily: 'Outfit',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.detail,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    fontSize: 40,
    color: '#fff',
  },
  profileNumbers: {
    borderWidth: 1,
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 6,
    borderColor: colors.detail,
    borderRadius: 100,
  },

numbersText: {
    fontFamily: 'Outfit',
    color: colors.ash,
},
following: {

},
followers: {

},


});
