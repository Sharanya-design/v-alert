import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
const CART_KEY = "valert_cart_v1";

export default function BandScreen() {
  const [qty, setQty] = useState("");

 const onAddToCart = async () => {
  const n = parseInt(qty || "0", 10);
  const safeQty = Number.isFinite(n) && n > 0 ? n : 1;

  const item = { id: "band", name: "V-ALERT NFC BAND", price: 12, qty: safeQty };

  const raw = await AsyncStorage.getItem(CART_KEY);
  const cart = raw ? JSON.parse(raw) : [];

  // if already in cart, increase qty
  const idx = cart.findIndex((x: any) => x.id === item.id);
  if (idx >= 0) cart[idx].qty += item.qty;
  else cart.push(item);

  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));

  router.push("/cart"); // go to cart after adding
};
const onBuyNow = () => router.push("/cart");


  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>V-ALERT NFC BAND</Text>

      <Text style={styles.desc}>
        This band is the secondary to the V-ALERT app. Purchase the band to sync the allergy information and to scan on kiosk’s.
      </Text>

      <Text style={styles.price}>$12.00</Text>

      <View style={styles.qtyRow}>
        <Text style={styles.qtyLabel}>QTY.</Text>
        <TextInput
          value={qty}
          onChangeText={setQty}
          placeholder="Enter Quantity"
          placeholderTextColor="#777"
          keyboardType="number-pad"
          style={styles.qtyInput}
        />
      </View>

      <Pressable style={[styles.btn, styles.btnGreen]} onPress={onAddToCart}>
        <Text style={styles.btnTextWhite}>Add To Cart</Text>
      </Pressable>

      <Pressable style={[styles.btn, styles.btnOutline]} onPress={onBuyNow}>
        <Text style={styles.btnTextDark}>Buy Now</Text>
      </Pressable>

      {/* Replace the image source with your real band image */}
     <Image
  source={require("../assets/images/image.png")}
  style={styles.bandImg}
  resizeMode="contain"
/>


      <Pressable style={[styles.btn, styles.btnGreen, { marginTop: 18 }]} onPress={() => router.replace("/(tabs)/home")}>
        <Text style={styles.btnTextWhite}>BACK TO HOME</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 30 },

  title: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 10 },
  desc: { color: "#444", lineHeight: 20, marginBottom: 14 },
  price: { color: "#3f8b3a", fontSize: 22, fontWeight: "800", marginBottom: 14 },

  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  qtyLabel: { color: "#444", fontWeight: "700" },
  qtyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111",
    backgroundColor: "#fff",
  },

  btn: { paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  btnGreen: { backgroundColor: "#4f7f3a" },
  btnOutline: { borderWidth: 1, borderColor: "#d9d9d9", backgroundColor: "#fff" },
  btnTextWhite: { color: "#fff", fontWeight: "800" },
  btnTextDark: { color: "#111", fontWeight: "800" },

  bandImg: { width: "100%", height: 220, marginTop: 16 },
});
