import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import colors from '@/styles/theme';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore, auth, storage } from "../../fireBaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";
import { Photo } from '@/types/types';
import uuid from 'react-native-uuid';

const cropAndUploadPhotos = async (photos: Photo[]): Promise<string[]> => {
  try {
    const storage = getStorage();
    const downloadURLs: string[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo.kept || !photo.uri) continue;

      // Crop and convert the photo to a 1:1 square ratio
      const croppedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { crop: { originX: 0, originY: 0, width: 300, height: 300 } }, // Adjust dimensions if needed
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Convert the cropped image to a blob
      const response = await fetch(croppedImage.uri);
      const blob = await response.blob();

      // Generate a unique file name for the photo
      const fileName = `posts/${auth.currentUser?.uid || "user"}_${Date.now()}_${i}.jpg`;

      // Upload the photo to Firebase Storage
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      downloadURLs.push(downloadURL);

      console.log(`Photo ${i + 1} uploaded successfully:`, downloadURL);
    }

    return downloadURLs;
  } catch (error) {
    console.error("Error uploading photos:", error);
    throw error;
  }
};

export default function PhotoSelectorScreen() {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<{ uri: string; kept: boolean; loading: boolean }[]>(Array(6).fill({ uri: '', kept: false, loading: false }));
  const [fetchCount, setFetchCount] = useState(0);
  const fetchLimit = 6; // Maximum number of fetches allowed
  const isAnyPhotoLoading = photos.some((photo) => photo.loading);
  const [modalVisible, setModalVisible] = useState(false);

  const confirmPostUpload = () => {
    setModalVisible(true);
  };
    
  const handleUploadConfirmation = async (confirm: boolean) => {
    if (!confirm) {
      setModalVisible(false);
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user logged in');
        return;
      }
  
      const postsRef = collection(firestore, 'posts');
      const uploadPromises = photos
        .filter((photo) => photo.uri) // Ensure photo has a valid URI
        .map(async (photo) => {
          // Upload each photo to Firebase Storage
          const uniqueFilename = `${user.uid}_${Date.now()}_${uuid.v4()}.jpg`
          const photoRef = ref(storage, `posts/${uniqueFilename}`);
          const response = await fetch(photo.uri);
          const blob = await response.blob();
          await uploadBytes(photoRef, blob);
  
          // Get the public download URL
          const downloadUrl = await getDownloadURL(photoRef);
  
          // Save the post to Firestore
          await addDoc(postsRef, {
            userId: user.uid,
            imageUrl: downloadUrl,
            timestamp: serverTimestamp(),
          });
  
          return downloadUrl;
        });
  
      await Promise.all(uploadPromises);
      console.log('Photos uploaded successfully');
      Alert.alert('Success', 'Your photos have been posted!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error uploading posts:', error);
      Alert.alert('Error', 'Failed to upload photos.');
    }
  };
        
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  // Fetch photos and select random 6
  const fetchPhotos = async () => {
    if (!permission) {
      alert('Permission is required to access photos.');
      return;
    }

    if (fetchCount >= fetchLimit) {
      alert('No more fetches available. Please confirm or cancel your post.');
      return;
    }

    setFetchCount((prevCount) => prevCount + 1);
    setLoadingState(true);

    let allPhotos: MediaLibrary.Asset[] = [];
    let nextPage = true;
    let after: string | undefined;

    // Fetch all photos in pages
    while (nextPage) {
      const { assets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
        after,
        first: 100,
        mediaType: ['photo'],
      });

      allPhotos = [...allPhotos, ...assets];
      after = endCursor;
      nextPage = hasNextPage;
    }

    // Randomly select photos to fill remaining slots that are not kept
    const shuffled = allPhotos.sort(() => 0.5 - Math.random());

    // Update photos with properly formatted URIs
    const newPhotos = await Promise.all(
      photos.map(async (photo) => {
        if (photo.kept) {
          return photo; // Keep the photo as is if it's marked as kept
        }

        // Fetch the next random asset and get its local URI
        const nextAsset = shuffled.pop();
        if (nextAsset) {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(nextAsset.id);
          return { uri: assetInfo.localUri || '', kept: false, loading: false };
        }

        return { uri: '', kept: false, loading: false }; // Fallback in case there are no more photos
      })
    );

    setPhotos(newPhotos);
    setLoadingState(false);
  };

  // Function to set loading state for each photo that is not kept
  const setLoadingState = (loading: boolean) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.kept ? photo : { ...photo, loading }))
    );
  };

  // Toggle photo selection without changing order
  const toggleKeepPhoto = (index: number) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index && photo.uri ? { ...photo, kept: !photo.kept } : photo))
    );
  };

  // Calculate if all photos are kept
  const allPhotosKept = photos.every((photo) => photo.kept);

  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Requesting Permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Permission Denied</Text>
      </SafeAreaView>
    );
  }

  return (
<View style={styles.container}>
  <View style={styles.contentContainer}>
    <FlatList
      data={photos}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.photoList}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => toggleKeepPhoto(index)} disabled={item.loading || !item.uri}>
          <View style={styles.photoContainer}>
            {item.loading ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.loaderSpinner} />
            ) : item.uri ? (
              <>
                <Image source={{ uri: item.uri }} style={styles.photo} />
                {item.kept && (
                  <View style={styles.overlay}>
                    <Icon name="check" size={24} color="white" style={styles.checkmarkIcon} />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptySlot} />
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  </View>

  {/* Fetch Counter */}
  <View style={styles.fetchCounterWrapper}>
    {allPhotosKept ? (
      <Icon name="check" size={35} color={colors.volt} style={styles.checkmarkIcon} />
    ) : (
      <Text style={styles.fetchCounterText}>{fetchLimit - fetchCount}</Text>
    )}
  </View>

  {/* Button */}
  <TouchableOpacity
    style={[
      styles.button,
      allPhotosKept ? styles.confirmButton : styles.fetchButton,
    ]}
    onPress={allPhotosKept ? confirmPostUpload : fetchPhotos}
    disabled={isAnyPhotoLoading || fetchCount >= fetchLimit}
  >
    <Text
      style={[
        styles.buttonText,
        allPhotosKept && styles.confirmButtonText,
      ]}
    >
      {allPhotosKept ? 'confirm' : 'fetch'}
    </Text>
  </TouchableOpacity>
  <Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
>
  <View style={styles.modalContainer}>
    <Text style={styles.modalText}>Are you sure you want to post this collection?</Text>
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButtonNo} onPress={() => handleUploadConfirmation(false)}>
        <Text style={styles.modalButtonTextNo}>cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButtonYes} onPress={() => handleUploadConfirmation(true)}>
        <Text style={styles.modalButtonTextYes}>absolutely</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

</View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.night,
    height: '100%',
    paddingTop: 56,
    paddingHorizontal: 10,
    
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  fetchButton: {
    backgroundColor: colors.night,
    borderColor: colors.detail,
  },
  buttonText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
    color: colors.ivory,
  },
  confirmButton: {
    backgroundColor: colors.volt,
    borderColor: colors.volt,
    justifyContent: 'center'
  },
  confirmButtonText: {
    color: colors.night,
    fontWeight: 700,
  },
  fetchCounterWrapper: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.detail,
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    top: '81.75%',
    left: '81.6%',
    zIndex: 6,
    backgroundColor: colors.night,
  },  
  fetchCounterText: {
    fontSize: 35,
    fontWeight: '400',
    color: colors.volt,
    fontFamily: 'Outfit',
  },
  photoList: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoContainer: {
    position: 'relative',
    margin: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  photo: {
    width: 180,
    height: 180,
    borderRadius: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(208, 240, 25, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    textAlign: 'center',
  },
  loaderSpinner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 180,
  },
  emptySlot: {
    width: 180,
    height: 180,
    backgroundColor: colors.night,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.detail,
  },
  modalContainer: {
    flexDirection: 'column',
    alignSelf: 'center',
    // borderWidth: 1,
    // borderColor: colors.detail,
    marginTop: '75%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    borderRadius: 11,
  },
  modalText: {
    fontFamily: 'Outfit',
    color: colors.ivory,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: '8%',
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // borderWidth: 1,
    // borderColor: colors.ivory,
    width: '100%',
  },
  modalButtonYes: {
    borderWidth: 1,
    borderColor: colors.volt,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 15,
    borderRadius: 100,
    backgroundColor: colors.volt,
  },
  modalButtonNo: {
    borderWidth: 1,
    borderColor: colors.detail,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 15,
    borderRadius: 100,    
  },
  modalButtonTextYes: {
    color: colors.night,
    fontFamily: 'Outfit',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtonTextNo: {
    color: colors.ivory,
    fontFamily: 'Outfit',
    fontSize: 20,
    fontWeight: 'regular',
  },
});
