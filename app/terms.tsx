import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const TERMS_KEY = "valert_terms_accepted_v1";

export default function TermsScreen() {
  const onAgree = async () => {
    await AsyncStorage.setItem(TERMS_KEY, "true");
    router.replace("/(tabs)/home"); // change if your post-login route is different
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Valert App — Terms & Conditions</Text>
        <Text style={styles.sub}>
          By signing up and using the Valert app (“App”), you agree to the following terms:
        </Text>

        <Text style={styles.h}>1. Acceptance of Terms</Text>
        <Text style={styles.p}>
          By creating an account and using the App, you agree to follow these terms. If you do not agree,
          you may not use the App.
        </Text>

        <Text style={styles.h}>2. User Accounts</Text>
        <Text style={styles.p}>
          You must provide accurate information when signing up. You are responsible for keeping your
          account credentials secure. You must be at least 13 years old to use the App.
        </Text>

        <Text style={styles.h}>3. Use of the App</Text>
        <Text style={styles.p}>
          The App is designed to help users manage allergies and interact with compatible devices. You
          agree to use the App only for lawful purposes and not to disrupt or misuse the App.
        </Text>

        <Text style={styles.h}>4. Health & Safety Disclaimer</Text>
        <Text style={styles.p}>
          The App provides allergy tracking and notifications, but it does not replace professional medical
          advice. Always consult a doctor or healthcare professional regarding allergies, treatments, or
          emergencies. The App is not liable for any injury, allergic reaction, or loss resulting from use.
        </Text>

        <Text style={styles.h}>5. Privacy / HIPAA Notice</Text>
        <Text style={styles.p}>
          Your personal information, allergy details, and device data may be stored in the App. Your data
          will be used according to the Privacy Policy.
          {"\n\n"}
          Note: This screen is an acknowledgment page. If you need true HIPAA compliance, you’ll also need
          proper legal review + technical safeguards.
        </Text>

        <Text style={styles.h}>6. Intellectual Property</Text>
        <Text style={styles.p}>
          All content, graphics, and code in the App are owned by V-Alert. You may not copy, reproduce, or
          distribute any content without permission.
        </Text>

        <Text style={styles.h}>7. Termination</Text>
        <Text style={styles.p}>
          We reserve the right to suspend or terminate accounts that violate these terms. You may also
          deactivate your account at any time.
        </Text>

        <Text style={styles.h}>8. Limitation of Liability</Text>
        <Text style={styles.p}>
          The App is provided “as is.” We are not responsible for indirect, incidental, or consequential damages.
        </Text>

        <Text style={styles.h}>9. Changes to Terms</Text>
        <Text style={styles.p}>
          We may update these terms from time to time. Continued use after updates constitutes acceptance.
        </Text>

        <Pressable style={styles.agreeBtn} onPress={onAgree}>
          <Text style={styles.agreeText}>✓ I AGREE</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export { TERMS_KEY };

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 18, paddingBottom: 28 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  sub: { color: "#444", marginBottom: 14, lineHeight: 20 },
  h: { fontSize: 16, fontWeight: "700", marginTop: 12, marginBottom: 6 },
  p: { color: "#222", lineHeight: 20 },
  agreeBtn: {
    marginTop: 18,
    backgroundColor: "#4c8a2b",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  agreeText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
