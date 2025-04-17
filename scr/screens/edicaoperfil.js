import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebaseConfig';

const EdicaoPerfil = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [foto, setFoto] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const usuario = auth.currentUser;
        const docRef = doc(db, 'usuarios', usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setNome(dados.nome || '');
          setEmail(usuario.email || '');
          setFoto(dados.foto || null);
        }
      } catch (error) {
        Alert.alert('Erro ao carregar dados do perfil');
      }
    };

    carregarDadosUsuario();
  }, []);

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImagemSelecionada(result.assets[0].uri);
    } else {
      Alert.alert('Nenhuma imagem selecionada.');
    }
  };

  const fazerUploadImagem = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `perfil_imagem/${userId}`); 
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const salvarAlteracoes = async () => {
    const usuario = auth.currentUser;

    try {
      if (novaSenha) {
        await updatePassword(usuario, novaSenha);
      }

      let urlFoto = foto;
      if (imagemSelecionada) {
        urlFoto = await fazerUploadImagem(imagemSelecionada, usuario.uid);
        setFoto(urlFoto);
      }

      const docRef = doc(db, 'usuarios', usuario.uid);
      await updateDoc(docRef, {
        nome: nome,
        foto: urlFoto,
      });

      Alert.alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar alterações', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Perfil</Text>

      {foto && <Image source={{ uri: foto }} style={styles.imagemPerfil} />}
      <TouchableOpacity onPress={selecionarImagem}>
        <Text style={styles.selecionarImagem}>Selecionar nova imagem</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[styles.input, styles.inputDesativado]}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova senha (opcional)"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <Button title="Salvar Alterações" onPress={salvarAlteracoes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagemPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  selecionarImagem: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputDesativado: {
    backgroundColor: '#e0e0e0',
    color: '#777',
  },
});

export default EdicaoPerfil;
