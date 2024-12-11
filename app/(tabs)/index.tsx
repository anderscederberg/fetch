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
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import colors from '@/styles/theme';

export default function PhotoSelectorScreen() {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<{ uri: string; kept: boolean; loading: boolean }[]>(Array(6).fill({ uri: '', kept: false, loading: false }));
  const [fetchCount, setFetchCount] = useState(0);
  const fetchLimit = 6; // Maximum number of fetches allowed
  const isAnyPhotoLoading = photos.some((photo) => photo.loading);


  // Request photo permissions on mount
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
    onPress={allPhotosKept ? () => Alert.alert('Confirmed!') : fetchPhotos}
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
});
