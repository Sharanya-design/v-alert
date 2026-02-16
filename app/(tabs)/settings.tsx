import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Row = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.row}>
    <Text style={styles.rowText}>{label}</Text>
    <Text style={styles.chev}>›</Text>
  </Pressable>
);

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Settings</Text>

      <View style={styles.card}>
        <Row label="Account" onPress={() => {}} />
        <Row label="Payments" onPress={() => {}} />
        <Row label="History" onPress={() => {}} />
        <Row label="Devices" onPress={() => {}} />
      </View>

      <Pressable
        style={[styles.greenBtn, { marginTop: 18 }]}
        onPress={() => router.push("/band")}
      >
        <Text style={styles.greenBtnText}>BUY V-ALERT NFC BAND</Text>
      </Pressable>

      <Pressable
        style={[styles.greenBtn, { marginTop: 14 }]}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.greenBtnText}>BACK TO HOME</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 14,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    overflow: "hidden",
  },

  row: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  rowText: { fontSize: 16, color: "#333" },
  chev: { fontSize: 22, color: "#999" },

  greenBtn: {
    backgroundColor: "#4f7f3a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },

  greenBtnText: { color: "#fff", fontWeight: "800" },
});
