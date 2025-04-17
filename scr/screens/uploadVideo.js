import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import s3 from '../../awsConfig';

export default function UploadVideo({ categoriaDefault = '', onUploadComplete }) {
  const [video, setVideo] = useState(null);
  const [categoria, setCategoria] = useState(categoriaDefault);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const response = await s3
        .listObjectsV2({
          Bucket: 'bucket-storage-senai-29',
          Prefix: 'videos/',
          Delimiter: '/',
        })
        .promise();

      const folders = (response.CommonPrefixes || []).map((prefix) => {
        const folderPath = prefix.Prefix;
        return folderPath.replace('videos/', '').replace('/', '');
      });

      setCategorias(folders);

      if (!categoria && folders.length > 0) {
        setCategoria(folders[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro ao buscar categorias', error.message);
    } finally {
      setLoadingCategorias(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['video/*'], copyToCacheDirectory: true, });
    const asset = result.assets && result.assets.length > 0 ? result.assets[0] : results;

    if (asset && asset.uri) {
      setVideo({
        uri: asset.uri,
        name: asset.name, 
        type: asset.mimeType 
      })
    }
    console.log(result, asset)

    if (result.type === 'success') {
      console.log('Vídeo selecionado:', result);
      if (!result.uri || !result.mimeType.includes('video')) {
        Alert.alert('Erro', 'O arquivo selecionado não é um vídeo');
        return;
      }
      setVideo(result);
    }
  };

  const uploadVideo = async () => {
    if (!video || !categoria) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    try {
      console.log('Buscando arquivo de URI:', video.uri);
      const response = await fetch(video.uri);

      if (!response.ok) {
        throw new Error('Erro ao carregar o vídeo da URI');
      }

      const blob = await response.blob();
      console.log('Blob gerado:', blob);

      const filePath = `videos/${categoria}/${Date.now()}-${video.name}`;

      const params = {
        Bucket: 'bucket-storage-senai-29',
        Key: filePath,
        Body: blob,
        ContentType: blob.type || 'video/mp4',
      };

      // Usando o método upload para o S3
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Erro ao fazer upload para S3:', err);
          Alert.alert('Erro', err.message || 'Erro ao fazer upload');
        } else {
          console.log('Upload bem-sucedido:', data);
          Alert.alert('Vídeo enviado com sucesso!');
          setVideo(null);
          setCategoria('');
          if (onUploadComplete) onUploadComplete();
        }
      });
    } catch (err) {
      console.error('Erro durante o processo de upload:', err);
      Alert.alert('Erro inesperado', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Escolher Vídeo" onPress={pickVideo} />

      {loadingCategorias ? (
        <ActivityIndicator style={{ marginVertical: 10 }} />
      ) : categorias.length === 0 ? (
        <>
          <Text style={styles.warning}>Nenhuma categoria encontrada.</Text>
          <Button title="Recarregar Categorias" onPress={fetchCategorias} />
        </>
      ) : (
        <>
          <Button title="Escolher Categoria" onPress={() => setModalVisible(true)} />
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Selecione uma categoria</Text>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => {
                      setCategoria(cat);
                      setModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
                <Button title="Fechar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      )}

      <Button title="Enviar" onPress={uploadVideo} disabled={!categoria || !video} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  warning: {
    color: '#ff0000',
    textAlign: 'center',
    marginVertical: 10,
  },
});
