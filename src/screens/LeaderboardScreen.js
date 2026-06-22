import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { styles } from "../style/globalStyles";
import { auth, db } from "../services/firebase";
import { collection, doc, getDoc, getDocs, query, orderBy } from "firebase/firestore";

export default function LeaderboardScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const usersQuery = query(
          collection(db, "users"),
          orderBy("points", "desc"),
        );
        const snap = await getDocs(usersQuery);
        const leaderboard = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(leaderboard);

        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileName(data.username || currentUser.email || "Pilota");
            setUserPhoto(data.photo || null);
            setUserPoints(data.points || 0);
          }

          const rank = leaderboard.findIndex((user) => user.id === currentUser.uid) + 1;
          setUserRank(rank || null);
        }
      } catch (error) {
        console.error("Errore leaderboard:", error);
      }
    }

    loadLeaderboard();
  }, []);

  const renderUser = ({ item, index }) => {
    const isTop3 = index < 3;
    const isCurrentUser = currentUser && item.id === currentUser.uid;
    return (
      <View style={[styles.leaderboardItem, isTop3 && styles.leaderboardTopItem, isCurrentUser && styles.leaderboardCurrentUser]}>
        <View style={styles.leaderboardLeft}>
          <Text style={styles.leaderboardPosizione}>{index + 1}</Text>
          <View>
            <Text style={styles.leaderboardNome}>{item.username || item.email}</Text>
            <Text style={styles.leaderboardSubtext}>{item.wins || 0} vittorie</Text>
          </View>
        </View>
        <View style={styles.leaderboardRightContainer}>
          <Text style={styles.leaderboardScore}>{item.points || 0} pt</Text>
          {isCurrentUser && <Text style={styles.leaderboardStar}>⭐</Text>}
        </View>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.dashboardCard}>
      <Text style={styles.dashboardTitle}>Dashboard</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{userPoints}</Text>
          <Text style={styles.statLabel}>Punti Totali</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{userRank || "-"}</Text>
          <Text style={styles.statLabel}>Posizione</Text>
        </View>
      </View>
    </View>
  );

  function BottomNav({ current, onNavigate }) {
    return (
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => onNavigate("Home")}> 
          <Text
            style={
              current === "Home"
                ? styles.navLabelActive
                : styles.navLabel
            }
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate("Leaderboard")}> 
          <Text
            style={
              current === "Leaderboard"
                ? styles.navLabelActive
                : styles.navLabel
            }
          >
            Classifica
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate("Users")}> 
          <Text
            style={
              current === "Users"
                ? styles.navLabelActive
                : styles.navLabel
            }
          >
            Amici
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleNavigate = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  return (
    <SafeAreaView style={styles.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0b0f" />
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.ciao}>Classifica</Text>
          <Text style={styles.garaBadge}>Guarda la tua posizione</Text>
        </View>
        <View style={styles.avatar}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {profileName ? profileName[0].toUpperCase() : "?"}
            </Text>
          )}
        </View>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ListFooterComponent={renderFooter}
      />
      <BottomNav current="Leaderboard" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}
