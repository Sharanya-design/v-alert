// app/kid/[kidId].tsx
import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../firebaseConfig";

type Kid = {
  id: string;
  name?: string;
  allergies?: string[];
  severity?: string;
  createdAt?: any;
};

export default function KidDetails() {
  const { kidId } = useLocalSearchParams<{ kidId: string }>();

  const [loading, setLoading] = useState(true);
  const [kid, setKid] = useState<Kid | null>(null);
  const [error, setError] = useState("");

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
});