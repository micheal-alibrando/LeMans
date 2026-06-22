import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../style/globalStyles";

export default function OnBoardingScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF3821" />
      <View style={styles.content}>
        <Image
          source={require("../assets/logo_bianco.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require("../assets/race-red-car.png")}
          style={styles.car}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>24h LE MANS</Text>
          <Text style={styles.description}>
            Scegli i piloti che finiranno sul podio delle gare.{"\n"}
            Sfida i tuoi amici e confronta le previsioni.{"\n"}
            Guadagna punti e scala la classifica.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Signup")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>ENTRA IN GARA ORA!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
