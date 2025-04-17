import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);
const BUCKET_URL = 'https://bucket-storage-senai-29.s3.amazonaws.com/';

export default function Perfil({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'perfil'));
        const profilesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(profilesData);
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar perfis');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('EdicaoPerfil', { userId: item.id })}
    >
      {item.imageKey && (
        <Image
          source={{ uri: `${BUCKET_URL}${item.imageKey}` }}
          style={styles.profileImage}
        />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loader: {
    flex: 1,
    justifyContent: 'center'
  },
  list: {
    padding: 15
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529'
  },
  email: {
    fontSize: 14,
    color: '#6c757d'
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  }
});