import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../firebaseConfig";

type Kid = {
  name?: string;
  allergies?: string[];
  severity?: string;
};

export default function Explore() {

  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState("");
const [ uidInput, setUidInput] = useState("");
  const [kid, setKid] = useState<Kid | null>(null);

  async function handleLookup() {
    const uid = uidInput.trim();
    if (!uid) {
      setError("Enter a Band UID");
      return;
    }

    setLoading(true);
    setError("");
    setKid(null);

    try {
      // 1) Look up tag doc: tags/{uid}
      const tagRef = doc(db, "tags", uid);
      const tagSnap = await getDoc(tagRef);

      if (!tagSnap.exists()) {
        setError("Band not registered.");
        return;
      }

      const tagData = tagSnap.data() as { parentUid?: string; kidId?: string };

      if (!tagData.parentUid || !tagData.kidId) {
        setError("Tag record missing parentUid or kidId.");
        return;
      }

      // 2) Fetch kid doc: users/{parentUid}/kids/{kidId}
      const kidRef = doc(db, "users", tagData.parentUid, "kids", tagData.kidId);
      const kidSnap = await getDoc(kidRef);

      if (!kidSnap.exists()) {
        setError("Kid record not found for this band.");
        return;
      }

      setKid(kidSnap.data() as Kid);
    } catch (e: any) {
      console.log("Lookup error:", e);
      setError(e?.message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Lookup</Text>

      <Text style={styles.subtitle}>
        (Demo: type the band UID like you scanned it)
      </Text>

<TextInput
  placeholder="Enter Band UID"
  placeholderTextColor="#555555"
  value={uidInput}
  onChangeText={setUidInput}
  style={styles.input}
/>

      />

      <Pressable style={styles.button} onPress={handleLookup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Looking..." : "Lookup"}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {kid ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{kid.name ?? "Unnamed child"}</Text>
          <Text style={styles.cardSub}>
            Allergies: {kid.allergies?.length ? kid.allergies.join(", ") : "None"}
          </Text>
          <Text style={styles.cardSub}>Severity: {kid.severity ?? "Unknown"}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    color: "#111111",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
