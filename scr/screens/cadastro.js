import React, { useState } from 'react';
import { 
  Alert, 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Platform, 
  ActivityIndicator, 
  Image, 
  Linking 
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { app } from '../../firebaseConfig';
import s3 from '../../awsConfig';

const auth = getAuth(app);
const db = getFirestore(app);

async function registerUser(email, password, name, imageUri) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let imageKey = null;
    if (imageUri) {
      const filename = `profile_${Date.now()}.jpg`;
      imageKey = `perfil_imagem/${filename}`;

      const response = await fetch(imageUri);
      const blob = await response.blob();

      await s3.upload({
        Bucket: 'bucket-storage-senai-29',
        Key: imageKey,
        Body: blob,
        ContentType: 'image/jpeg'
      }).promise();
    }

    await setDoc(doc(db, 'perfil', user.uid), {
      uid: user.uid,
      email,
      name,
      imageKey: imageKey || '',
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    let errorMessage = 'Falha no cadastro';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'E-mail já está em uso!';
        break;
      case 'auth/weak-password':
        errorMessage = 'Senha deve ter 6+ caracteres';
        break;
    }
    Alert.alert('Erro', errorMessage);
    throw error;
  }
}

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Por favor, permita acesso à galeria nas configurações do dispositivo',
          [
            { text: 'Cancelar' },
            { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao acessar a galeria: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      if (!email || !password || !name) {
        Alert.alert('Atenção', 'Preencha todos os campos');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert('Erro', 'Formato de e-mail inválido');
        return;
      }

      await registerUser(email, password, name, imageUri);
      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.navigate('Perfil');
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Perfil</Text>

      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={pickImage}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="add-a-photo" size={40} color="#666" />
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha *"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        placeholder="Nome Completo *"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#007bff'
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
});
