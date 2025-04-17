// Samuel Boaz de Morais Gonçalves

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Lampada({ navigation }) {
  const [isOn, setIsOn] = useState(false);

  const toggleLight = () => {
    setIsOn(!isOn);
  };

  return (
    <View style={[styles.container, { backgroundColor: isOn ? '#FFF' : '#000' }]}> 
      <Ionicons 
        name={isOn ? 'bulb' : 'bulb-outline'} 
        size={100} 
        color={isOn ? '#FFD700' : '#808080'} 
        style={styles.lampIcon}
      />
      
      <Text style={[styles.texto, { color: isOn ? '#000' : '#FFF' }]}>
        {isOn ? 'Lâmpada Ligada' : 'Lâmpada Desligada'}
      </Text>

      <TouchableOpacity style={styles.botao} onPress={toggleLight}>
        <Text style={styles.botaoTexto}>Interruptor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={isOn ? '#000' : '#FFF'} />
        <Text style={[styles.voltarTexto, { color: isOn ? '#000' : '#FFF' }]}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lampIcon: {
    marginBottom: 20,
  },
  texto: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#FFD760',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  voltarTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
