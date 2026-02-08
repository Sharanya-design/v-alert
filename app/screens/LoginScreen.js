// app/screens/LoginScreen.js

import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable, Alert } from "react-native";
import { auth } from "../firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      router.replace("/(tabs)/home");
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <View style={styles.container}>
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