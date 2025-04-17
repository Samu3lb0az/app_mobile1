import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import s3 from '../../awsConfig';

export default function UploadImagem() {
  const [image, setImage] = useState(null);

  const escolherImagem = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permissão negada');

    const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const uploadImage = async () => {
    if (!image) return Alert.alert('Selecione uma imagem');

    const response = await fetch(image);
    const blob = await response.blob();
    const fileName = `imagens/${Date.now()}.jpg`;

    const params = {
      Bucket: 'bucket-storage-senai-29',
      Key: fileName,
      Body: blob,
      ContentType: 'image/jpeg',
    };

    s3.upload(params, (err, data) => {
      if (err) Alert.alert('Erro', err.message);
      else Alert.alert('Sucesso!', `URL: ${data.Location}`);
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Escolher Imagem" onPress={escolherImagem} color="#007bff" />
      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}
      <Button title="Upload para AWS" onPress={uploadImage} color="#28a745" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
