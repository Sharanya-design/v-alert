import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const CART_KEY = "valert_cart_v1";

type CartItem = {
  id: string;
  name: string;
  price: number; // each
  qty: number;
};

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([]);

  const load = async () => {
    const raw = await AsyncStorage.getItem(CART_KEY);
    setItems(raw ? JSON.parse(raw) : []);
  };

  const save = async (next: CartItem[]) => {
    setItems(next);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const removeItem = async (id: string) => {
    const next = items.filter((x) => x.id !== id);
    await save(next);
  };

  const clearCart = async () => {
    await save([]);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Cart</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {items.length === 0 ? (
          <Text style={styles.empty}>Your cart is empty.</Text>
        ) : (
          items.map((it) => (
            <View key={it.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{it.name}</Text>
                <Text style={styles.meta}>
                  ${it.price.toFixed(2)} × {it.qty}
                </Text>
              </View>

              <Text style={styles.lineTotal}>
                ${(it.price * it.qty).toFixed(2)}
              </Text>

              <Pressable onPress={() => removeItem(it.id)} style={styles.removeBtn}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

        <Pressable
          style={[styles.btn, styles.btnGreen]}
          onPress={() => alert("Checkout coming soon!")}
          disabled={items.length === 0}
        >
          <Text style={styles.btnTextWhite}>Checkout</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnOutline]}
          onPress={clearCart}
          disabled={items.length === 0}
        >
          <Text style={styles.btnTextDark}>Clear Cart</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnGreen]} onPress={() => router.back()}>
          <Text style={styles.btnTextWhite}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12, color: "#111" },
  empty: { color: "#666", marginTop: 20 },

  card: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#111" },
  meta: { color: "#666", marginTop: 4 },
  lineTotal: { fontWeight: "800", color: "#111" },

  removeBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  removeText: { color: "red", fontWeight: "700" },

  footer: { paddingTop: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  total: { fontSize: 18, fontWeight: "800", marginBottom: 10, color: "#111" },

  btn: { paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  btnGreen: { backgroundColor: "#4f7f3a" },
  btnOutline: { borderWidth: 1, borderColor: "#d9d9d9", backgroundColor: "#fff" },
  btnTextWhite: { color: "#fff", fontWeight: "800" },
  btnTextDark: { color: "#111", fontWeight: "800" },
});
