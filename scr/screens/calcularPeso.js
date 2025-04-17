// Samuel Boaz de Morais Gonçalves

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Peso() {
  const navigation = useNavigation();
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(null);

  const calcularIMC = () => {
    const alturaEmMetros = parseFloat(altura) / 100;
    const imcCalculado = parseFloat(peso) / (alturaEmMetros * alturaEmMetros);
    setImc(imcCalculado.toFixed(2));
  };

  return (
    <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
      <Text style={styles.title}>Calculadora de IMC</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite seu peso (kg)"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
        placeholderTextColor="#e3f2fd"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Digite sua altura (cm)"
        keyboardType="numeric"
        value={altura}
        onChangeText={setAltura}
        placeholderTextColor="#e3f2fd"
      />
      
      <TouchableOpacity style={styles.button} onPress={calcularIMC}>
        <Text style={styles.buttonText}>Calcular IMC</Text>
      </TouchableOpacity>

      {imc && <Text style={styles.result}>Seu IMC é: {imc}</Text>}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PaginaPrincipal')}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffffff',
    fontSize: 16,
    color: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: '600',
  },
  result: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});

