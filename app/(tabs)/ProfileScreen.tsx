import colors from '@/styles/theme';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {

    const [profileImage, setProfileImage] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
        <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
            <Text style={styles.placeholder}>+</Text>
            )}
            </TouchableOpacity>
            <View style={styles.profileInfoContainer}>
                <Text style={styles.username}>dersy.legend11</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.follow}>
                        <Text>follow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>follow</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ash,
    height: '100%',
    paddingTop: 75,
    paddingHorizontal: 25
  },
  profileContainer: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  profileInfoContainer: {
    flexDirection: 'column',
    borderWidth: 1,
  },
  username: {
    color: colors.ivory,
    fontFamily: 'Outfit',
    fontSize: 25,
  },
  buttonContainer: {

  },
  follow: {

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
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
