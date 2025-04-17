import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import s3 from '../../awsConfig';

export default function ListarImagem() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = {
        Bucket: 'bucket-storage-senai-29',
        Prefix: 'imagens/',
      };
      const data = await s3.listObjectsV2(params).promise();

      const files = (data.Contents || [])
        .filter(file => file?.Key?.match(/\.(jpg|jpeg|png)$/i))
        .map(file => ({
          key: file.Key,
          name: file.Key.split('/').pop(),
          url: `https://bucket-storage-senai-29.s3.amazonaws.com/${file.Key}`,
        }));

      setImages(files);
    } catch (err) {
      console.error('Erro ao listar imagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const escolherImagem = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permissão negada');

    const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      setUploading(true);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `imagens/${Date.now()}.jpg`;

      const params = {
        Bucket: 'bucket-storage-senai-29',
        Key: fileName,
        Body: blob,
        ContentType: 'image/jpeg',
      };

      s3.upload(params, (err, data) => {
        if (err) {
          Alert.alert('Erro no upload', err.message);
        } else {
          Alert.alert('Sucesso!', 'Imagem enviada com sucesso.');
          fetchImages(); // Atualiza lista
        }
        setUploading(false);
      });
    } catch (err) {
      setUploading(false);
      Alert.alert('Erro inesperado', err.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cardButton} onPress={escolherImagem}>
        <Text style={styles.cardButtonText}>
          {uploading ? 'Enviando imagem...' : 'Enviar nova imagem'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <FlatList
          data={images}
          ListEmptyComponent={<Text style={styles.loadingText}>Nenhuma imagem encontrada.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  cardButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  cardText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  loading: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});
