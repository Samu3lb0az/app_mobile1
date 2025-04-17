import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, updateDoc, Timestamp } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { app } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const db = getFirestore(app);

const EditarJogador = ({ route, navigation }) => {
  const { jogador } = route.params;
  const [nome, setNome] = useState(jogador.nome);
  const [altura, setAltura] = useState(String(jogador.altura));
  const [camisa, setCamisa] = useState(String(jogador.camisa));
  const [nascimento, setNascimento] = useState(jogador.nascimento);

  const handleSave = async () => {
    if (!nome || !altura || !camisa || !nascimento) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const [day, month, year] = nascimento.split('/');
      const nascimentoDate = new Date(`${year}-${month}-${day}`);
      const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

      const jogadorRef = doc(db, "real-madrid", jogador.id);
      await updateDoc(jogadorRef, {
        nome,
        altura: parseFloat(altura),
        camisa: parseInt(camisa),
        nascimento: nascimentoTimestamp
      });

      Alert.alert("Sucesso", "Jogador atualizado!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  };

  return (
    <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Jogador</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#cfd8dc"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Altura (ex: 1.75)"
          placeholderTextColor="#cfd8dc"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        <TextInput
          style={styles.input}
          placeholder="Número da camisa"
          placeholderTextColor="#cfd8dc"
          keyboardType="numeric"
          value={camisa}
          onChangeText={setCamisa}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#cfd8dc"
          value={nascimento}
          onChangeText={setNascimento}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#0D47A1',
    fontWeight: '700',
    fontSize: 18,
  }
});

export default EditarJogador;
