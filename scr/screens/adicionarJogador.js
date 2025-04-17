// Samuel Boaz de Morais Gonçalves

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { app } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const db = getFirestore(app);

const AdicionarJogador = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [altura, setAltura] = useState('');
  const [camisa, setCamisa] = useState('');
  const [nascimento, setNascimento] = useState('');

  const handleAdd = async () => {
    if (!nome || !altura || !camisa || !nascimento) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
  
    try {
      const [day, month, year] = nascimento.split('/');
      if (!day || !month || !year) throw new Error("Data inválida");
  
      const nascimentoDate = new Date(`${year}-${month}-${day}`);
      if (isNaN(nascimentoDate.getTime())) throw new Error("Data inválida");
  
      const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);
  
      const jogador = {
        nome,
        altura: parseFloat(altura),
        camisa: parseInt(camisa),
        nascimento: nascimentoTimestamp,
      };
  
      console.log("Salvando jogador:", jogador); // ← Veja no console do Metro
  
      await addDoc(collection(db, "real-madrid"), jogador);
  
      Alert.alert("Sucesso", "Jogador adicionado!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao adicionar jogador:", error);
      Alert.alert("Erro", "Não foi possível adicionar o jogador. Verifique os dados.");
    }
  };
  

  return (
    <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Adicionar Jogador</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#bbdefb"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Altura (ex: 1.75)"
          placeholderTextColor="#bbdefb"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        <TextInput
          style={styles.input}
          placeholder="Número da camisa"
          placeholderTextColor="#bbdefb"
          keyboardType="numeric"
          value={camisa}
          onChangeText={setCamisa}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#bbdefb"
          value={nascimento}
          onChangeText={setNascimento}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Adicionar Jogador</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
    marginRight: 28, // Para alinhar com o botão de voltar
  },
  form: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdicionarJogador;
