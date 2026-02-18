import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "./firebaseConfig";

export default function KidNew() {
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState("");
const [bandUid, setBandUid] = useState("");
const [scannerOpen, setScannerOpen] = useState(false);
const [scannedOnce, setScannedOnce] = useState(false);

const [permission, requestPermission] = useCameraPermissions();

const openScanner = async () => {
  if (!permission?.granted) {
    const res = await requestPermission();
    if (!res.granted) {
      Alert.alert("Camera Permission", "Please allow camera access to scan the band QR code.");
      return;
    }
  }
  setScannedOnce(false);
  setScannerOpen(true);
};

const handleBarcodeScanned = ({ data }: { data: string }) => {
  if (scannedOnce) return;
  setScannedOnce(true);

  const cleaned = String(data).trim();
  setBandUid(cleaned);

  setScannerOpen(false);
};


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
  bandUid: bandUid.trim() || null,
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
<TextInput
  style={styles.input}
  placeholder="Band UID (scan QR)"
  placeholderTextColor="#555"
  value={bandUid}
  onChangeText={setBandUid}
  autoCapitalize="none"
/>

<Pressable style={styles.button} onPress={openScanner}>
  <Text style={styles.buttonText}>Scan QR</Text>
</Pressable>


      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Child</Text>
      </Pressable>
<Modal visible={scannerOpen} animationType="slide">
  <View style={{ flex: 1 }}>
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={handleBarcodeScanned}
    />

    <View style={{ position: "absolute", top: 60, left: 0, right: 0, alignItems: "center" }}>
      <Text style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: 10, borderRadius: 10 }}>
        Point camera at the band QR
      </Text>

      <Pressable
        onPress={() => setScannerOpen(false)}
        style={{ marginTop: 12, backgroundColor: "rgba(0,0,0,0.6)", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>
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