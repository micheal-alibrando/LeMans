import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
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

export default function UsersScreen() {
  const currentUser = auth.currentUser;

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  if (!currentUser) return <Text>Loading...</Text>;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await fetchFriends();
    await fetchPendingRequests();
    await fetchSentRequests();
  }

  async function fetchFriends() {
    const data = await getFriends(currentUser.uid);

    let full = [];
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

    let full = [];
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

    let full = [];
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
    <View
      style={{
        backgroundColor: "#111",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      {children}
    </View>
  );

  const Title = ({ children }) => (
    <Text
      style={{
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      {children}
    </Text>
  );

  const ButtonUI = ({ title, onPress, danger }) => (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: danger ? "#ff3b30" : "#007AFF",
        padding: 10,
        borderRadius: 10,
        marginTop: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
      {/* ADD FRIEND */}
      <Title>Aggiungi amico</Title>

      <View
        style={{
          backgroundColor: "#111",
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <TextInput
          placeholder="Codice amico"
          placeholderTextColor="#666"
          value={code}
          onChangeText={(t) => {
            setCode(t);
            setCodeError("");
          }}
          style={{
            color: "white",
            padding: 10,
          }}
        />

        {codeError ? (
          <Text style={{ color: "#ff3b30", marginTop: 5 }}>{codeError}</Text>
        ) : null}

        <ButtonUI
          title="Invia richiesta"
          onPress={async () => {
            if (!code) return setCodeError("Inserisci un codice");

            const user = await findUserByCode(code);

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

      {/* FRIENDS */}
      <Title>Amici</Title>

      {friends.map((f) => (
        <Card key={f.friendshipId}>
          <Text style={{ color: "white", fontSize: 16 }}>{f.username}</Text>

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

      {/* REQUESTS */}
      <Title>Richieste ricevute</Title>

      {pendingRequests.map((r) => (
        <Card key={r.friendshipId}>
          <Text style={{ color: "white" }}>{r.username}</Text>

          <ButtonUI
            title="Accetta"
            onPress={async () => {
              await acceptFriend(r.friendshipId);
              loadData();
            }}
          />
        </Card>
      ))}

      {/* SENT */}
      <Title>Richieste inviate</Title>

      {sentRequests.map((r) => (
        <Card key={r.friendshipId}>
          <Text style={{ color: "white" }}>{r.username}</Text>
          <Text style={{ color: "#888", marginTop: 5 }}>In attesa...</Text>
        </Card>
      ))}
    </ScrollView>
  );
}
