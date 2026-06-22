import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signup } from "../auth/signup";
import { useNavigation } from "@react-navigation/native";
import { isUsernameTaken } from "../services/userService";
import { styles } from "../style/globalStyles";

export default function SignupScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleFirebaseError = (e) => {
    switch (e.code) {
      case "auth/email-already-in-use":
        setErrors({ email: "Email già registrata" });
        break;

      case "auth/weak-password":
        setErrors({ password: "Password troppo debole" });
        break;

      case "auth/invalid-email":
        setErrors({ email: "Email non valida" });
        break;

      default:
        setErrors({ general: "Errore imprevisto" });
    }
  };

  const handleSignup = async () => {
    let newErrors = {};

    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername) newErrors.username = "Inserisci username";
    else if (cleanUsername.length < 3)
      newErrors.username = "Minimo 3 caratteri";
    else if (/\s/.test(cleanUsername))
      newErrors.username = "Niente spazi nel username";

    if (!email) newErrors.email = "Inserisci l'email";
    if (!password) newErrors.password = "Inserisci la password";

    const taken = await isUsernameTaken(cleanUsername);

    if (taken) newErrors.username = "Username già preso";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      await signup(email, password, cleanUsername);

      setEmail("");
      setPassword("");
      setUsername("");
      setErrors({});

      navigation.replace("Users");
    } catch (e) {
      handleFirebaseError(e);
    } finally {
      setLoading(false);
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
        <Text style={styles.loginTitle}>REGISTRATI</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          {errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
          {errors.general && <Text style={styles.error}>{errors.general}</Text>}
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>
            {loading ? "Creazione account..." : "Registrati"}
          </Text>
        </TouchableOpacity>
        <Text
          onPress={() => {
            setEmail("");
            setPassword("");
            setUsername("");
            setErrors({});
            navigation.navigate("Login");
          }}
          style={styles.link}
        >
          Hai già un account? <Text style={{ fontWeight: "bold" }}>Accedi</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
