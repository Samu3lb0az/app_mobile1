// Samuel Boaz de Morais Gonçalves

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, collection, getDocs, Timestamp, doc, deleteDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { app } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native'; 

const db = getFirestore(app);

const JogadoresReal = ({ navigation }) => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "real-madrid"));
            const playersData = [];
    
            querySnapshot.forEach((document) => {
                const playerData = document.data();
                if (playerData.nascimento instanceof Timestamp) {
                    playerData.nascimento = playerData.nascimento.toDate().toLocaleDateString();
                } else {
                    playerData.nascimento = "Desconhecido";
                }
                playersData.push({ id: document.id, ...playerData });
            });
    
            setPlayers(playersData);
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            Alert.alert("Erro", "Erro ao carregar dados dos jogadores.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPlayers();
        }, [])
    );

    const handleDelete = async (playerId) => {
        try {
          console.log('Tentando excluir documento:', playerId);
          const jogadorRef = doc(db, "real-madrid", playerId);
      
          console.log('Referência do documento:', jogadorRef.path);
      
          await deleteDoc(jogadorRef);
          console.log('Documento excluído com sucesso');
      
          setPlayers(prevPlayers =>
            prevPlayers.filter(player => player.id !== playerId)
          );
        } catch (error) {
          console.error("Erro ao excluir jogador:", error);
        }
      };
      

    const handleEdit = (player) => {
        navigation.navigate('EditarJogador', { jogador: player });
    };

    return (
        <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Jogadores</Text>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AdicionarJogador')}
                    >
                        <Ionicons name="add" size={28} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" style={styles.loading} />
                ) : players.length > 0 ? (
                    players.map((player) => (
                        <View key={player.id} style={styles.card}>
                            <View style={styles.playerInfo}>
                                <Text style={styles.playerName}>{player.nome || 'Nome não informado'}</Text>
                                <Text style={styles.playerDetails}>Altura: {player.altura || 'Não informada'}</Text>
                                <Text style={styles.playerDetails}>Camisa: {player.camisa || 'N/A'}</Text>
                                <Text style={styles.playerDetails}>Nascimento: {player.nascimento}</Text>
                            </View>

                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => handleEdit(player)}>
                                    <Ionicons name="pencil" size={24} color="#4ad166" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDelete(player.id)}>
                                    <Ionicons name="trash" size={24} color="#FF6347" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.loadingText}>Nenhum jogador encontrado</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: 10,
    },
    addButton: {
        marginLeft: 'auto',
    },
    headerText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center',
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#FFf', 
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 10,
    },
    playerDetails: {
        fontSize: 16,
        color: '#e3f2fd',
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
    },
    loadingText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    loading: {
        marginVertical: 20,
    },
});

export default JogadoresReal;