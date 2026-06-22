import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../style/globalStyles";
import { db, auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  sendFriendRequest,
  getPendingRequests,
  getSentRequests,
  getFriends,
  acceptFriend,
  removeFriend,
  findUserByCode,
} from "../services/friends";

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

export default function FriendsScreen({ navigation }) {
  const currentUser = auth.currentUser;

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  async function loadData() {
    await fetchFriends();
    await fetchPendingRequests();
    await fetchSentRequests();
  }

  async function fetchFriends() {
    const data = await getFriends(currentUser.uid);

    const full = [];
    for (const f of data) {
      const userSnap = await getDoc(doc(db, "users", f.uid));
      if (userSnap.exists()) {
        full.push({ friendshipId: f.id, ...userSnap.data() });
      }
    }
    setFriends(full);
  }

  async function fetchPendingRequests() {
    const data = await getPendingRequests(currentUser.uid);

    const full = [];
    for (const r of data) {
      const userSnap = await getDoc(doc(db, "users", r.from));
      if (userSnap.exists()) {
        full.push({ friendshipId: r.id, ...userSnap.data() });
      }
    }
    setPendingRequests(full);
  }

  async function fetchSentRequests() {
    const data = await getSentRequests(currentUser.uid);

    const full = [];
    for (const r of data) {
      const friendUid = r.users.find((u) => u !== currentUser.uid);
      const userSnap = await getDoc(doc(db, "users", friendUid));
      if (userSnap.exists()) {
        full.push({ friendshipId: r.id, ...userSnap.data() });
      }
    }
    setSentRequests(full);
  }

  const Card = ({ children }) => (
    <View style={styles.garaCard}>{children}</View>
  );

  const Title = ({ children }) => (
    <Text style={styles.sezioneTitolo}>{children}</Text>
  );

  const ButtonUI = ({ title, onPress, danger }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: danger ? "#ff3b30" : "#ff3b30",
          opacity: pressed ? 0.8 : 1,
        },
        {
          padding: 12,
          borderRadius: 12,
          marginTop: 10,
          alignItems: "center",
        },
      ]}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.homeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0b0b0f" />
        <View style={styles.loginContent}>
          <Text style={{ color: "white" }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0b0f" />
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.ciao}>Amici</Text>
          <Text style={styles.garaBadge}>Gestisci la tua cerchia</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}> 
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.garaCard}>
          <Text style={styles.garaTitolo}>Invia richiesta</Text>
          <TextInput
            placeholder="Codice amico"
            placeholderTextColor="#666"
            value={code}
            onChangeText={(t) => {
              setCode(t);
              setCodeError("");
            }}
            style={styles.input}
          />
          {codeError ? <Text style={styles.error}>{codeError}</Text> : null}

          <ButtonUI
            title="Invia richiesta"
            onPress={async () => {
              const enteredCode = code.toLowerCase().trim();
              if (!enteredCode) return setCodeError("Inserisci un codice");

              const user = await findUserByCode(enteredCode);
              if (!user) return setCodeError("Utente non trovato");

              try {
                await sendFriendRequest(currentUser.uid, user.id);
                setCode("");
                setCodeError("");
                loadData();
              } catch (e) {
                setCodeError(e.message);
              }
            }}
          />
        </View>

        <Title>Amici</Title>
        {friends.map((f) => (
          <Card key={f.friendshipId}>
            <Text style={styles.garaTitolo}>{f.username}</Text>
            <ButtonUI
              title="Rimuovi amico"
              danger
              onPress={async () => {
                await removeFriend(f.friendshipId);
                loadData();
              }}
            />
          </Card>
        ))}

        <Title>Richieste ricevute</Title>
        {pendingRequests.map((r) => (
          <Card key={r.friendshipId}>
            <Text style={styles.garaTitolo}>{r.username}</Text>
            <ButtonUI
              title="Accetta"
              onPress={async () => {
                await acceptFriend(r.friendshipId);
                loadData();
              }}
            />
          </Card>
        ))}

        <Title>Richieste inviate</Title>
        {sentRequests.map((r) => (
          <Card key={r.friendshipId}>
            <Text style={styles.garaTitolo}>{r.username}</Text>
            <Text style={{ color: "#888", marginTop: 8 }}>In attesa...</Text>
          </Card>
        ))}
      </ScrollView>

      <BottomNav current="Users" onNavigate={(route) => navigation.navigate(route)} />
    </SafeAreaView>
  );
}
