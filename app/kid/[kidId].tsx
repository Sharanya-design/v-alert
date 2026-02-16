// app/kid/[kidId].tsx
import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
}
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
      )}
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