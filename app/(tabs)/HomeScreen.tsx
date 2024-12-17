import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import colors from '@/styles/theme';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../fireBaseConfig';

export default function HomeScreen() {
  const [posts, setPosts] =  useState<{ id: String; imageUrl: string }[]>([]);
  
  const fetchPosts = async () => {
    try {
      const postsRef = collection(firestore, 'posts');
      const q = query(postsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        imageUrl: doc.data().imageUrl,
      }));

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.night,
    paddingTop: 65,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
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
  testButton: {
    marginTop: 20,
    backgroundColor: colors.volt,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  testButtonText: {
    color: colors.night,
    fontSize: 16,
    fontWeight: 'bold',
  },


});
