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
        autoCapitalize="none"
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing= {handleLookup}
        autoCorrect= {false}

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
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 20,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    width: "100%",
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontWeight: "600",
  },
  error: {
    marginTop: 12,
    color: "red",
    fontWeight: "600",
  },
  card: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    width: "100%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardSub: {
    fontSize: 16,
    marginTop: 4,
  },
});