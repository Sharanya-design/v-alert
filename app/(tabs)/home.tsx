// app/(tabs)/home.tsx

import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { auth, db } from "../firebaseConfig"; // <- IMPORTANT: home.tsx is inside app/(tabs)

type Kid = {
  id: string;
  name?: string;
allergies?: string[];
severity?: string;
  createdAt?: any;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState<Kid[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const user = auth.currentUser;

console.log("LOGGED IN UID:", user?.uid);
console.log("LOGGED IN EMAIL:", user?.email);

    if (!user) {
      router.replace("/login");
      return;
    }

    // Listen to kids in: users/{uid}/kids
    const kidsRef = collection(db, "users", user.uid, "kids");
    const q = query(kidsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Kid[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setKids(list);
        setError("");
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>V-Alert Home</Text>

      <Text style={styles.subtitle}>
        Logged in as {"\n"}
        {String(auth.currentUser?.email ?? "Unknown")}
      </Text>

      {error ? <Text style={styles.error}>{String(error)}</Text> : null}

      <Pressable
        style={styles.button}
        onPress={() => router.push("/kid-new" as any)} // "as any" avoids the TS route warning for now
      >
        <Text style={styles.buttonText}>Add Child</Text>
      </Pressable>

      {loading ? (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={{ width: "90%", marginTop: 16 }}>
          {kids.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>No children added yet</Text>
          ) : (
            kids.map((k) => (
             <Pressable 
key ={k.id}
style={styles.card}
onPress={ () => router.push(`/kid/${k.id}`)}>
                <Text style={styles.cardTitle}>{String(k.name ?? "Unnamed child")}</Text>
                <Text style={styles.cardSub}>
    Allergies: {k.allergies?.length ? k.allergies.join(", ") : "None"}
    </Text>
    <Text style={styles.cardSub}>
        Severity: {k.severity ? k.severity : "Unknown"}
    </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

      <Pressable style={[styles.button, { marginTop: 18 }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
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
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 14,
  },
  error: {
    color: "red",
    marginVertical: 10,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 12,
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
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cardSub: {
    fontSize: 16,
    marginTop: 6,
    color: "#444",
  },
});