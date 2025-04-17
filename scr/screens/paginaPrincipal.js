// Samuel Boaz de Morais Gonçalves

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db, collection, getDocs } from '../../firebaseConfig';

const PaginaPrincipal = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() });
            });
            setUsers(usersData);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            alert("Erro ao carregar dados dos usuários");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    return (
        <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcome}>Bem-vindo ao App!</Text>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => navigation.navigate("RealizarLogin")}
                    >
                        <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.subtitle}>O que deseja fazer hoje?</Text>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("Perfil")}
                    >
                        <Text style={styles.cardButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("SobreNos")}
                    >
                        <Text style={styles.cardButtonText}>Sobre Nós</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("JogadoresReal")}
                    >
                        <Text style={styles.cardButtonText}>Jogadores do Real Madrid</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("Lampada")}
                    >
                        <Text style={styles.cardButtonText}>Acenda sua Lâmpada!</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("CalcularPeso")}
                    >
                        <Text style={styles.cardButtonText}>Calcula o Peso</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("ListarImagem")}
                    >
                        <Text style={styles.cardButtonText}>Lista de Imagens</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => navigation.navigate("ListarVideo")}
                    >
                        <Text style={styles.cardButtonText}>Lista de vídeos</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardUsuarios}>
                    <Text style={styles.sectionTitle}>Dados dos Usuários</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#ffffff" style={styles.loading} />
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <View key={user.id} style={styles.userContainer}>
                                <Text style={styles.userText}>Nome: {user.nome || 'Não informado'}</Text>
                                <Text style={styles.userText}>Email: {user.email || 'Não informado'}</Text>
                                <Text style={styles.userText}>Endereço: {user.adress || 'Não informado'}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.loadingText}>Nenhum usuário encontrado</Text>
                    )}
                </View>

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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    welcome: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 18,
        color: '#e3f2fd',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
    },
    cardButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#007bff',
        alignItems: 'center',
    },
    cardButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    cardUsuarios: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 15,
        textAlign: 'center',
    },
    userContainer: {
        backgroundColor: "rgba(248, 249, 250, 0.8)",
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
    },
    userText: {
        fontSize: 16,
        color: '#495057',
        marginBottom: 5,
    },
    loadingText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
    loading: {
        marginVertical: 20,
    },
    logoutButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default PaginaPrincipal;
