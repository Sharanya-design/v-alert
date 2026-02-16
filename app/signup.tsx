import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "./firebaseConfig"; // your file on the left is app/firebaseConfig.js

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!email.trim()) return setError("Email required");
    if (password.length < 6) return setError("Password must be 6+ characters");
    if (password !== confirm) return setError("Passwords do not match");

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Success", "Account created!");
      router.back(); // goes back to login
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

     <TextInput
  placeholder="Email"
  placeholderTextColor="#000000"
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
  style={styles.input}
/>


    <TextInput
  placeholder="Password"
  placeholderTextColor="#000000"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  style={styles.input}
/>


    <TextInput
  placeholder="Confirm Password"
  placeholderTextColor="#000000"
  value={confirm}
  onChangeText={setConfirm}
  secureTextEntry
  style={styles.input}
/>


      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
        <Text style={{ color: "blue" }}>Back to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    color: "#111111",
  },
  button: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
