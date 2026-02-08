import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { router } from "expo-router";

export default function KidNew() {
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      setError("");
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setError("Not logged in");
        return;
      }

      if (!name.trim()) {
        setError("Child name is required");
        return;
      }

      const allergyList = allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      await addDoc(collection(db, "users", uid, "kids"), {
        name: name.trim(),
        allergies: allergyList,
        severity: severity.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      });

      router.back();
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to save child"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Child</Text>

      {error ? <Text style={styles.error}>{String(error)}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Child name"
        placeholderTextColor="#555"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Allergies (comma separated)"
        placeholderTextColor="#555"
        value={allergies}
        onChangeText={setAllergies}
      />

      <TextInput
        style={styles.input}
        placeholder="Severity (Low / Medium / High)"
        placeholderTextColor="#555"
        value={severity}
        onChangeText={setSeverity}
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Child</Text>
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
    color: "#000",
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