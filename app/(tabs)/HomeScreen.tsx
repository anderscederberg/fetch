import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import colors from '@/styles/theme';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../fireBaseConfig';

export default function HomeScreen() {
  const [posts, setPosts] =  useState<{ id: string; imageUrl: string }[]>([]);

 const [loading, setLoading] = useState(false);
  
 const fetchPosts = async () => {
  setLoading(true);
  setPosts([]);
  try {
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    const fetchedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      imageUrl: doc.data().imageUrl,
    }));
    setPosts(fetchedPosts);
    console.log('Fetched one post:', fetchedPosts);
  } catch (error) {
    console.error('Error fetching post:', error);
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
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={{ margin: 10 }}>
      <Text>ID: {item.id}</Text>
      <Text>URL: {item.imageUrl}</Text>
    </View>
  )}
  style={{ flex: 1, backgroundColor: 'yellow' }}
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
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  refreshButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: colors.volt,
  },
  refreshText: {
    color: colors.night,
    fontSize: 16,
    fontWeight: 'bold',
  },

});
