import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Video } from 'expo-av';
import s3 from '../../awsConfig';
import UploadVideo from './uploadVideo';
import { LinearGradient } from 'expo-linear-gradient';

export default function ListarVideo() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await s3.listObjectsV2({
        Bucket: 'bucket-storage-senai-29',
        Prefix: 'videos/',
        Delimiter: '/',
      }).promise();

      const folders = response.CommonPrefixes.map(prefix => {
        const folderPath = prefix.Prefix;
        return folderPath.replace('videos/', '').replace('/', '');
      });

      setCategories(folders);

      if (folders.length > 0 && !category) {
        setCategory(folders[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchVideos = async () => {
    if (!category) return;

    setLoading(true);
    try {
      const prefix = `videos/${category}/`;
      const response = await s3.listObjectsV2({
        Bucket: 'bucket-storage-senai-29',
        Prefix: prefix,
      }).promise();

      const videoFiles = response.Contents?.filter(file =>
        file.Size > 0 && !file.Key.endsWith('/')
      );

      const videoUrls = videoFiles?.map(file => ({
        key: file.Key,
        name: file.Key.split('/').pop(),
        url: `https://bucket-storage-senai-29.s3.amazonaws.com/${encodeURI(file.Key)}`,
      }));

      setVideos(videoUrls);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      fetchVideos();
    }
  }, [category]);

  const handleUploadComplete = () => {
    fetchCategories();
    fetchVideos();
    setShowUpload(false);
  };

  return (
    <LinearGradient colors={['#64B5F6', '#1E88E5']} style={styles.container}>
      <View style={styles.innerContainer}>
        {loadingCategories ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        )}

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setShowUpload(prev => !prev)}
        >
          <Text style={styles.uploadButtonText}>
            {showUpload ? 'Fechar Upload' : 'Upload de Vídeo'}
          </Text>
        </TouchableOpacity>

        {showUpload && (
          <UploadVideo
            categoriaDefault={category}
            onUploadComplete={handleUploadComplete}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : videos.length === 0 ? (
          <Text style={styles.noVideosText}>Nenhum vídeo encontrado.</Text>
        ) : (
          <FlatList
            data={videos}
            renderItem={({ item }) => (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: item.url }}
                  useNativeControls
                  resizeMode="contain"
                  style={styles.video}
                />
                <Text style={styles.videoName}>{item.name}</Text>
              </View>
            )}
            keyExtractor={item => item.key}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  picker: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  videoContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  video: {
    width: '100%',
    height: 250,
  },
  videoName: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
  noVideosText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});
