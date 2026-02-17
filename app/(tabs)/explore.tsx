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
  value={uidInput}
  onChangeText={setUidInput}
  placeholder="Enter Band UID"
  placeholderTextColor="#666666"
  autoCapitalize="none"
  style={styles.input}
  returnKeyType="search"
  onSubmitEditing={handleLookup}
  autoCorrect={false}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    textAlign: "center",
    color: "#444444",
  },

  input: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    color: "#111111",
    marginBottom: 15,
  },

  button: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },

  error: {
    marginTop: 12,
    color: "red",
    fontWeight: "600",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111111",
  },

  cardSub: {
    fontSize: 14,
    marginTop: 4,
    color: "#444444",
  },
});
