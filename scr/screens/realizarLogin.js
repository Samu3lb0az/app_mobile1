// Samuel Boaz de Morais Gonçalves

import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebaseConfig";

const RealizarLogin = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");

    const tentarLogar = () => {
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, senha)
            .then(() => {
                navigation.navigate("PaginaPrincipal");
            })
            .catch((error) => {
                console.error('Login failure:', error);
                alert("Erro ao realizar login. Verifique suas credenciais.");
            });
    };

    return (
        <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.titulo}>Bem-vindo</Text>

                <TextInput 
                    placeholder="Email" 
                    placeholderTextColor="#999"
                    value={email} 
                    onChangeText={setEmail} 
                    style={styles.input} 
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <TextInput 
                    placeholder="Senha" 
                    placeholderTextColor="#999"
                    value={senha} 
                    onChangeText={setSenha} 
                    secureTextEntry 
                    style={styles.input} 
                />
                
                <TouchableOpacity onPress={tentarLogar} style={styles.botaoEntrar}>
                    <Text style={styles.textoBotao}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 30
    },
    box: {
        backgroundColor: "rgba(224, 224, 224, 0.8)",
        padding: 20,
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center"
    },
    input: {
        height: 50,
        borderColor: "#DDD",
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: "#FFF",
        elevation: 2
    },
    botaoEntrar: {
        backgroundColor: "#0D47A1",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        elevation: 3
    },
    textoBotao: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    }
});

export default RealizarLogin;
