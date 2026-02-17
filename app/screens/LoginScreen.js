// app/screens/LoginScreen.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

await AsyncStorage.removeItem("valert_terms_accepted_v1"); // TEMP
const accepted = await AsyncStorage.getItem("valert_terms_accepted_v1");
router.replace(accepted === "true" ? "/(tabs)/home" : "/terms");
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <View style={styles.container}>

  <Image
    source={require("../../assets/images/logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />

  <Text style={styles.title}>V-Alert Login</Text>



    {error ? <Text style={styles.error}>{String(error)}</Text> : null}

    <TextInput
      style={styles.input}
      placeholder="Email"
      placeholderTextColor="#555"
      value={email}
      autoCapitalize="none"
      onChangeText={setEmail}
    />

    <TextInput
      style={styles.input}
      placeholder="Password"
      placeholderTextColor="#555"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
    />
<Pressable style={styles.button} onPress={handleLogin}>
  <Text style={styles.buttonText}>Log In</Text>
</Pressable>
<Pressable onPress={() => router.push("/signup")} style={{ marginTop: 12 }}>
  <Text style={{ color: "#007AFF", fontWeight: "600" }}>
    Create an account
  </Text>
</Pressable>
  </View>
  
);
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  logo: {
    width: 180,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    color: "#000",          // <-- text color inside input
  },
  loginText: {
    marginTop: 10,
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginVertical: 10,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 10,
  },


button: {
  marginTop: 16,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  borderWidth: 1,
  alignItems: "center",
},

buttonText: {
  fontSize: 16,
  fontWeight: "600",
},
});