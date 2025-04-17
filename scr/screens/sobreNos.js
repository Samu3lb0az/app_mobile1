// Samuel Boaz de Morais Gonçalves

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const SobreNos = ({ navigation }) => {
    return (
        <LinearGradient colors={["#2196F3", "#0D47A1"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nossa História</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.text}>
                        Fundada em 2023, nossa empresa nasceu da paixão por criar soluções tecnológicas que transformam vidas. 
                        Combinamos inovação e design para oferecer experiências únicas aos nossos usuários.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nossa Equipe</Text>
                    <Text style={styles.text}>
                        Time qualificado com expertise em desenvolvimento mobile, design UX/UI e tecnologia de ponta.
                        Profissionais certificados e comprometidos com excelência em cada projeto.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nossos Valores</Text>
                    <Text style={styles.text}>
                        ✅ Inovação constante{"\n"}
                        ✅ Qualidade garantida{"\n"}
                        ✅ Transparência total{"\n"}
                        ✅ Satisfação do cliente
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#000" />
                    <Text style={styles.backButtonText}>Voltar ao Início</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20
    },
    header: {
        marginBottom: 25,
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#ffffff",
        marginVertical: 15
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: "#ffffff",
        textAlign: "justify"
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFD700",
        marginBottom: 15
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFD700", 
        padding: 16,
        borderRadius: 12,
        marginTop: 25,
        elevation: 3
    },
    backButtonText: {
        color: "#000",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 10
    }
});

export default SobreNos;
