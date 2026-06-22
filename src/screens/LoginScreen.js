import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "../auth/login";
import { styles } from "../style/globalStyles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Inserisci email");
      return;
    }

    if (!password) {
      setPasswordError("Inserisci password");
      return;
    }

    try {
      const user = await login(email, password);

      console.log("✅ LOGIN OK");
      console.log("UID:", user.uid);
      console.log("EMAIL:", user.email);

      setEmail("");
      setPassword("");

      navigation.replace("Home");
    } catch (e) {
      console.log("❌ LOGIN ERROR:", e.code);

      switch (e.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setPasswordError("Password errata");
          break;

        case "auth/user-not-found":
          setEmailError("Utente non trovato");
          break;

        case "auth/invalid-email":
          setEmailError("Email non valida");
          break;

        case "auth/too-many-requests":
          setPasswordError("Troppi tentativi, riprova più tardi");
          break;

        default:
          setPasswordError(e.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF3821" />
      <View style={styles.loginContent}>
        <Image
          source={require("../assets/logo_bianco.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.loginTitle}>ACCEDI</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.backButtonText}>Accedi</Text>
        </TouchableOpacity>

        <Text
          onPress={() => {
            setEmail("");
            setPassword("");
            setEmailError("");
            setPasswordError("");
            navigation.navigate("Signup");
          }}
          style={styles.link}
        >
          Non hai un account?{" "}
          <Text style={{ fontWeight: "bold" }}>Registrati</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
