import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import colors from '@/styles/theme';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../fireBaseConfig';
import Carousel from 'react-native-reanimated-carousel';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
const [posts, setPosts] = useState<{ id: string; imageUrls: string[]; }[]>([]);

 const [loading, setLoading] = useState(false);
  
 const fetchPosts = async () => {
  setLoading(true);
  setPosts([]);
  try {
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(10)); // Fetch last 10 posts
    const querySnapshot = await getDocs(q);

    const fetchedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      imageUrls: doc.data().imageUrls || [],
    }));

    setPosts(fetchedPosts);
    console.log('Fetched posts:', fetchedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setLoading(false);
  }
};

    useEffect(() => {
      fetchPosts();
    }, []);
  
    useEffect(() => {
    console.log('Posts state updated:', posts); // Logs posts state whenever it updates
  }, [posts]);
  
  return (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.fetchText}>fetch</Text>
        <Text style={styles.homeText}>home</Text>
        <TouchableOpacity 
          style={styles.searchWrapper}
        >
          <Image 
            source={require('../../assets/images/search.png')} 
            style={styles.search}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchPosts}>
          <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
      <FlatList
  data={posts}
  keyExtractor={(post) => post.id}
  renderItem={({ item }) => (
    <View style={styles.postContainer}>
      <Text style={{ display: 'none' }}>Post ID: {item.id}</Text>

      {/* Carousel for post images */}
      <Carousel
        loop={false}
        width={SCREEN_WIDTH * 0.9} // Slight margin on both sides
        height={300} // Adjust based on UI preference
        autoPlay={false}
        data={item.imageUrls} // Pass the array of image URLs
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.postImage}
            onError={(e) => console.error('Image load error:', item, e.nativeEvent.error)}
          />
        )}
      />
    </View>
  )}
/>    

</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow container to expand and fit its children
    alignItems: 'center',
    backgroundColor: colors.night,
    paddingTop: 65,
    width: '100%',
    height: '100%',
  },
    homeHeader: {
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
  homeText: {
    color: colors.volt,
    fontFamily: 'Outfit',
    fontSize: 20,
    marginRight: 45,
  },
  searchWrapper: {
    // borderWidth: 1,
    // padding: 5,
    // borderColor: colors.detail,
    // borderRadius: 100,
  },
  search: {
    width: 25,
    height: 25,
  },
  postContainer: {
    marginBottom: 20,
    overflow: 'hidden',
    borderColor: colors.detail,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.night,
    padding: 11,
  },
  postImage: {
    width: '100%',
    height: '100%',
    marginBottom: 100,
  },
  refreshButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: colors.volt,
    marginBottom: 20,
  },
  refreshText: {
    color: colors.night,
    fontSize: 16,
    fontWeight: 'bold',
  },

});
