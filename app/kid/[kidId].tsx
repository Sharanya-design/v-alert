// app/kid/[kidId].tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../firebaseConfig";

type Kid = {
  id: string;
  name?: string;
  allergies?: string[];
  severity?: string;
  createdAt?: any;
tagUID?: string | null;
};

export default function KidDetails() {
  const { kidId } = useLocalSearchParams<{ kidId: string }>();

  const [loading, setLoading] = useState(true);
  const [kid, setKid] = useState<Kid | null>(null);
  const [error, setError] = useState("");
const [ uidInput, setUidInput] = useState("");
const [ saving, setSaving] = useState(false);
const [scannerOpen, setScannerOpen] = useState(false);
const [scannedOnce, setScannedOnce] = useState(false);
const [permission, requestPermission] = useCameraPermissions();


  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!kidId || typeof kidId !== "string") {
      setError("Missing kidId");
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", user.uid, "kids", kidId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setKid(null);
          setError("Kid not found");
        } else {
          setKid({ id: snap.id, ...(snap.data() as any) });
          setError("");
        }
        setLoading(false);
      },
      (e) => {
        setError(String(e.message ?? "Failed to load kid"));
        setLoading(false);
      }
    );

    return () => unsub();
  }, [kidId]);

async function handleRegisterBand() {
    const user = auth.currentUser;
    if (!user || !kidId || typeof kidId !== "string") return;

    const uid = uidInput.trim();
    if (!uid) {
      setError("UID cannot be blank");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const tagRef = doc(db, "tags", uid);
      const tagSnap = await getDoc(tagRef);

      if (tagSnap.exists()) {
        setError("That band UID is already linked.");
        setSaving(false);
        return;
      }

      const kidRef = doc(db, "users", user.uid, "kids", kidId);
      await updateDoc(kidRef, { tagUID: uid });

      await setDoc(tagRef, {
        parentUid: user.uid,
        kidId,
        active: true,
        linkedAt: serverTimestamp(),
      });

      setUidInput("");
    } catch (e: any) {
      setError(e?.message || "Failed to register band");
    } finally {
      setSaving(false);
    }
  }
  async function handleUnlinkBand() {
  const user = auth.currentUser;
  if (!user || !kidId || typeof kidId !== "string") return;

  const currentUID = kid?.tagUID;
  if (!currentUID) {
    setError("No band linked to unlink.");
    return;
  }
const openScanner = async () => {
  if (!permission?.granted) {
    const res = await requestPermission();
    if (!res.granted) {
      Alert.alert("Camera Permission", "Please allow camera access to scan the band.");
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
  setUidInput(cleaned);   // VERY IMPORTANT — this connects to your input

  setScannerOpen(false);
};

  setSaving(true);
  setError("");

  try {
    // 1) Remove tagUID from kid
    const kidRef = doc(db, "users", user.uid, "kids", kidId);
    await updateDoc(kidRef, { tagUID: null });

    // 2) Delete tag doc
    const tagRef = doc(db, "tags", currentUID);
    await deleteDoc(tagRef);

  } catch (e: any) {
    console.log("Unlink error:", e);
    setError(e?.message || "Failed to unlink band");
  } finally {
    setSaving(false);
  }
}const openScanner = async () => {
  if (!permission?.granted) {
    const res = await requestPermission();
    if (!res.granted) {
      Alert.alert("Camera Permission", "Please allow camera access to scan the band.");
      return;
    }
  }
  setScannedOnce(false);
  setScannerOpen(true);
};

const extractUidFromQr = (raw: string) => {
  const s = String(raw).trim();

  // If QR is a URL like https://.../?uid=ABC123
  try {
    const url = new URL(s);
    const uid =
      url.searchParams.get("uid") ||
      url.searchParams.get("tag") ||
      url.searchParams.get("id") ||
      url.searchParams.get("code");

    if (uid) return uid.trim();
  } catch {
    // not a URL, keep going
  }

  // If QR is like "UID: ABC123" or "tagUID=ABC123"
  const m =
    s.match(/(?:uid|taguid|tag|id|code)\s*[:=]\s*([A-Za-z0-9_-]+)/i) ||
    s.match(/([A-Za-z0-9_-]{6,})/); // fallback: first “long-ish” token

  return (m?.[1] ?? s).trim();
};

const handleBarcodeScanned = ({ data }: { data: string }) => {
  if (scannedOnce) return;
  setScannedOnce(true);

  const uid = extractUidFromQr(data);
  setUidInput(uid);

  setScannerOpen(false);
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Details</Text>

      {loading ? (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text style={styles.error}>{String(error)}</Text>
      ) : !kid ? (
        <Text style={styles.subtitle}>No data</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{String(kid.name ?? "Unnamed child")}</Text>

          <Text style={styles.cardSub}>
            Allergies: {kid.allergies?.length ? kid.allergies.join(", ") : "None"}
          </Text>

          <Text style={styles.cardSub}>
            Severity: {kid.severity ? kid.severity : "Unknown"}
          </Text>
<Text style={styles.cardSub}>
    Band: {kid?.tagUID ? kid.tagUID : "No band linked"}
  </Text>

  <TextInput
    value={uidInput}
    onChangeText={setUidInput}
    placeholder="Enter Band UID"
    autoCapitalize="none"
    style={styles.input}
  />
<Pressable
  style={styles.button}
  onPress={openScanner}
>
  <Text style={styles.buttonText}>Scan QR</Text>
</Pressable>

  <Pressable
    style={styles.button}
    onPress={handleRegisterBand}
    disabled={saving}
  >
    <Text style={styles.buttonText}>
      {saving ? "Saving..." : "Register Band"}
    </Text>
  </Pressable>
  {kid?.tagUID ? (
  <Pressable
    style={styles.button}
    onPress={handleUnlinkBand}
    disabled={saving}
  >
    <Text style={styles.buttonText}>
      {saving ? "Saving..." : "Unlink Band"}
    </Text>
  </Pressable>
) : null}
        </View>
      )}<Modal visible={scannerOpen} animationType="slide">
  <View style={{ flex: 1 }}>
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={handleBarcodeScanned}
    />

    <View style={{
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      alignItems: "center"
    }}>
      <Text style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        padding: 10,
        borderRadius: 10
      }}>
        Scan Band QR Code
      </Text>

      <Pressable
        onPress={() => setScannerOpen(false)}
        style={{
          marginTop: 12,
          backgroundColor: "rgba(0,0,0,0.6)",
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 10
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          Close
        </Text>
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
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginVertical: 10,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  card: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardSub: {
    fontSize: 18,
    color: "#333",
    marginTop: 6,
  },
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  width: "100%",
  marginTop: 10,
},

button: {
  marginTop: 10,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  borderWidth: 1,
  alignItems: "center",
},

buttonText: {
  fontWeight: "600",
},
});