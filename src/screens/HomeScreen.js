import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../style/globalStyles";
import { auth, db } from "../services/firebase";
import { loadPrediction, savePrediction } from "../services/predictionService";
import { PILOTI, GARE } from "../data";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  limit,
  onSnapshot,
} from "firebase/firestore";

function CountdownTimer({ targetDate, label }) {
  const [remaining, setRemaining] = useState(getRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={{ marginTop: 6 }}>
      <Text style={styles.garaBadge}>{label}</Text>
      <Text style={styles.garaTimer}>{formatRemaining(remaining)}</Text>
    </View>
  );
}

function getRemaining(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds };
}

function formatRemaining({ days, hours, minutes, seconds }) {
  const pad = (value) => String(value).padStart(2, "0");
  if (days > 0) return `${days}g ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function BottomNav({ current, onNavigate }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => onNavigate("Home")}>
        <Text style={current === "Home" ? styles.navLabelActive : styles.navLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate("Leaderboard")}>
        <Text style={current === "Leaderboard" ? styles.navLabelActive : styles.navLabel}>Classifica</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate("Users")}>
        <Text style={current === "Users" ? styles.navLabelActive : styles.navLabel}>Amici</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen({ onGoBack, username, onGoToPrediction, navigation }) {
  const [profileName, setProfileName] = useState(username || "");
  const [userPhoto, setUserPhoto] = useState(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [primo, setPrimo] = useState(null);
  const [secondo, setSecondo] = useState(null);
  const [terzo, setTerzo] = useState(null);
  const [selezioneAttiva, setSelezioneAttiva] = useState(1);
  const [savedPrediction, setSavedPrediction] = useState(null);
  const [nextRace, setNextRace] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState(null);

  // --- CHAT ---
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef(null);

  const handleNavigate = (route) => {
    if (navigation && route) navigation.navigate(route);
  };

  // Carica dati utente
  useEffect(() => {
    async function loadUsernameAndPrediction() {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileName(data.username || currentUser.email || "Pilota");
        setUserPhoto(data.photo || null);
        setUserPoints(data.points || 0);
      }
      const prediction = await loadPrediction(currentUser.uid, "24h-le-mans");
      if (prediction) setSavedPrediction(prediction);
    }

    async function loadUserRank() {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const usersQuery = query(collection(db, "users"), orderBy("points", "desc"));
      const usersSnap = await getDocs(usersQuery);
      const usersList = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const rank = usersList.findIndex((user) => user.id === currentUser.uid) + 1;
      setUserRank(rank || null);
    }

    function findNextRace() {
      const now = Date.now();
      const upcoming = GARE.filter((race) => new Date(race.data).getTime() > now);
      const sorted = upcoming.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      setNextRace(sorted[0] || null);
    }

    findNextRace();
    loadUsernameAndPrediction();
    loadUserRank();
  }, [username]);

  // Sottoscrizione real-time alla chat
  useEffect(() => {
    const q = query(
      collection(db, "chat"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .reverse();
      setChatMessages(msgs);
      // scroll in fondo quando arrivano nuovi messaggi
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => unsub();
  }, []);

  async function handleSendChat() {
    const text = chatInput.trim();
    if (!text) return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setChatInput("");
    try {
      await addDoc(collection(db, "chat"), {
        uid: currentUser.uid,
        username: profileName,
        text,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Errore invio messaggio:", e);
    }
  }

  const displayName = username || profileName || "Pilota";
  const handleGoBackPrediction = () => setShowPrediction(false);

  function selezionaPilota(item) {
    if (primo?.id === item.id) setPrimo(null);
    if (secondo?.id === item.id) setSecondo(null);
    if (terzo?.id === item.id) setTerzo(null);
    if (selezioneAttiva === 1) setPrimo(item);
    if (selezioneAttiva === 2) setSecondo(item);
    if (selezioneAttiva === 3) setTerzo(item);
    if (selezioneAttiva === 1) setSelezioneAttiva(2);
    else if (selezioneAttiva === 2) setSelezioneAttiva(3);
  }

  async function confermaPrevisione() {
    if (!primo || !secondo || !terzo) return;
    const currentUser = auth.currentUser;
    if (!currentUser) { Alert.alert("Errore", "Utente non autenticato"); return; }
    try {
      const pointsEarned = await savePrediction(
        currentUser.uid, "24h-le-mans", primo, secondo, terzo,
        savedPrediction?.pointsEarned || 0,
      );
      const predictionToSave = { primo, secondo, terzo, pointsEarned };
      setSavedPrediction(predictionToSave);
      setUserPoints((current) => current + (pointsEarned - (savedPrediction?.pointsEarned || 0)));
      Alert.alert("Previsione", "Previsione inviata con successo");
      setShowPrediction(false);
    } catch (error) {
      console.error("Errore savePrediction:", error);
      Alert.alert("Errore", "Impossibile salvare la previsione");
    }
  }

  function renderPilota({ item }) {
    const isSelezionato = primo?.id === item.id || secondo?.id === item.id || terzo?.id === item.id;
    const posizioneSelezionata =
      primo?.id === item.id ? "1°" :
      secondo?.id === item.id ? "2°" :
      terzo?.id === item.id ? "3°" : null;

    return (
      <TouchableOpacity
        style={[styles.pilotaCard, isSelezionato && styles.pilotaSelezionato]}
        onPress={() => selezionaPilota(item)}
        activeOpacity={0.7}
      >
        <View style={styles.pilotaInfo}>
          <Text style={styles.pilotaNumero}>#{item.numero}</Text>
          <Text style={styles.pilotaNome}>{item.nome}</Text>
          <Text style={styles.pilotaTeam}>{item.team}</Text>
        </View>
        {posizioneSelezionata && (
          <View style={styles.posizioneBadge}>
            <Text style={styles.posizioneBadgeText}>{posizioneSelezionata}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (showPrediction) {
    return (
      <SafeAreaView style={styles.homeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0b0b0f" />
        <View style={styles.predictionHeader}>
          <TouchableOpacity onPress={handleGoBackPrediction}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.predictionTitle}>⚡ Fai la tua previsione</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.posizioniIndicator}>
          <TouchableOpacity
            style={[styles.posizioneBox, selezioneAttiva === 1 && styles.posizioneBoxAttiva, primo && styles.posizioneBoxCompiuta]}
            onPress={() => setSelezioneAttiva(1)}
          >
            <Text style={styles.posizioneBoxLabel}>1°</Text>
            <Text style={styles.posizioneBoxNome} numberOfLines={1}>{primo ? primo.nome : "Scegli..."}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.posizioneBox, selezioneAttiva === 2 && styles.posizioneBoxAttiva, secondo && styles.posizioneBoxCompiuta]}
            onPress={() => setSelezioneAttiva(2)}
          >
            <Text style={styles.posizioneBoxLabel}>2°</Text>
            <Text style={styles.posizioneBoxNome} numberOfLines={1}>{secondo ? secondo.nome : "Scegli..."}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.posizioneBox, selezioneAttiva === 3 && styles.posizioneBoxAttiva, terzo && styles.posizioneBoxCompiuta]}
            onPress={() => setSelezioneAttiva(3)}
          >
            <Text style={styles.posizioneBoxLabel}>3°</Text>
            <Text style={styles.posizioneBoxNome} numberOfLines={1}>{terzo ? terzo.nome : "Scegli..."}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.selezioneGuida}>
          {selezioneAttiva === 1 && "👆 Seleziona chi arriverà 1°"}
          {selezioneAttiva === 2 && "👆 Seleziona chi arriverà 2°"}
          {selezioneAttiva === 3 && !terzo && "👆 Seleziona chi arriverà 3°"}
          {primo && secondo && terzo && "✅ Previsione completa!"}
        </Text>
        {savedPrediction ? (
          <View style={styles.savedPredictionCard}>
            <Text style={styles.savedPredictionTitle}>Previsione salvata</Text>
            <Text style={styles.savedPredictionText}>1°: {savedPrediction.primo.nome}</Text>
            <Text style={styles.savedPredictionText}>2°: {savedPrediction.secondo.nome}</Text>
            <Text style={styles.savedPredictionText}>3°: {savedPrediction.terzo.nome}</Text>
          </View>
        ) : null}
        <FlatList
          data={PILOTI}
          renderItem={renderPilota}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pilotiList}
        />
        <TouchableOpacity
          style={[styles.bottoneConferma, (!primo || !secondo || !terzo) && styles.bottoneConfermaDisabilitato]}
          onPress={confermaPrevisione}
          disabled={!primo || !secondo || !terzo}
        >
          <Text style={styles.testoBottoneConferma}>
            {savedPrediction ? "✅ AGGIORNA PREVISIONE" : primo && secondo && terzo ? "✅ CONFERMA PREVISIONE" : "Seleziona 3 piloti"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0b0f" />

      <View style={styles.headerCard}>
        <View>
          <Text style={styles.ciao}>Ciao, {displayName}</Text>
          {nextRace ? (
            <CountdownTimer targetDate={nextRace.data} label={`Prossima gara: ${nextRace.nome}`} />
          ) : (
            <Text style={styles.garaBadge}>Nessuna gara programmata</Text>
          )}
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => setShowScoreModal(true)}>
            <Text style={styles.scoreIcon}>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            try { await auth.signOut(); } catch (error) { console.error("Errore logout:", error); }
            if (navigation && navigation.replace) navigation.replace("Login");
          }}>
            <View style={styles.avatar}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{displayName ? displayName[0].toUpperCase() : "?"}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showScoreModal} transparent animationType="fade" onRequestClose={() => setShowScoreModal(false)}>
        <View style={styles.scoreModalContainer}>
          <View style={styles.scoreModalContent}>
            <TouchableOpacity onPress={() => setShowScoreModal(false)}>
              <Text style={styles.scoreModalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.scoreModalTitle}>Dettaglio Punti</Text>
            <View style={styles.scoreDetailRow}>
              <Text style={styles.scoreDetailLabel}>posizione esatta +3 pt</Text>
            </View>
            <View style={styles.scoreDetailRow}>
              <Text style={styles.scoreDetailLabel}>in Top 5 ma posizione errata +1pt</Text>
            </View>
            <View style={styles.scoreDetailRow}>
              <Text style={styles.scoreDetailLabel}>Bonus: posizioni esatte +3pt</Text>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.garaCard}>
          <Text style={styles.garaBadge}>🏁 GARA IN CORSO</Text>
          <Text style={styles.garaTitolo}>
            {nextRace ? `${nextRace.nome} — ${nextRace.circuito}` : "Prossima gara in arrivo"}
          </Text>
          {nextRace ? (
            <CountdownTimer targetDate={nextRace.data} label="Chiude previsioni tra" />
          ) : (
            <Text style={styles.garaBadge}>Nessuna data disponibile</Text>
          )}
          <TouchableOpacity
            style={styles.bottonePrevisione}
            onPress={() => {
              if (savedPrediction) {
                setPrimo(savedPrediction.primo);
                setSecondo(savedPrediction.secondo);
                setTerzo(savedPrediction.terzo);
                setSelezioneAttiva(1);
              } else {
                setPrimo(null); setSecondo(null); setTerzo(null);
                setSelezioneAttiva(1);
              }
              setShowPrediction(true);
            }}
          >
            <Text style={styles.testoBottonePrevisione}>⚡ Fai la tua previsione ⚡</Text>
          </TouchableOpacity>
        </View>

        {savedPrediction ? (
          <View style={styles.savedPredictionCard}>
            <Text style={styles.savedPredictionTitle}>Ultima previsione salvata</Text>
            <Text style={styles.savedPredictionText}>1°: {savedPrediction.primo.nome}</Text>
            <Text style={styles.savedPredictionText}>2°: {savedPrediction.secondo.nome}</Text>
            <Text style={styles.savedPredictionText}>3°: {savedPrediction.terzo.nome}</Text>
            <TouchableOpacity
              style={[styles.bottoneConferma, { marginTop: 10 }]}
              onPress={() => {
                setPrimo(savedPrediction.primo);
                setSecondo(savedPrediction.secondo);
                setTerzo(savedPrediction.terzo);
                setSelezioneAttiva(1);
                setShowPrediction(true);
              }}
            >
              <Text style={styles.testoBottoneConferma}>✏️ Modifica</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.sezioneTitolo}>📊 I tuoi numeri</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{userPoints}</Text>
            <Text style={styles.statLabel}>Punti Totali</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{userRank || "-"}</Text>
            <Text style={styles.statLabel}>Rank Globale</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{savedPrediction?.pointsEarned || 0}</Text>
            <Text style={styles.statLabel}>Punti previsione</Text>
          </View>
        </View>

        <Text style={styles.sezioneTitolo}>🏁 Ultime gare</Text>
        <View style={styles.garaItem}>
          <View>
            <Text style={styles.garaRound}>Round 2</Text>
            <Text style={styles.garaCircuito}>Le Mans</Text>
          </View>
          <View style={styles.garaDestra}>
            <Text style={styles.garaPosizione}>Pos: 2°</Text>
            <Text style={styles.garaPuntiVerde}>✅ +10 pt</Text>
          </View>
        </View>
        <View style={styles.garaItem}>
          <View>
            <Text style={styles.garaRound}>Round 1</Text>
            <Text style={styles.garaCircuito}>Spa</Text>
          </View>
          <View style={styles.garaDestra}>
            <Text style={styles.garaPosizione}>Pos: 4°</Text>
            <Text style={styles.garaPuntiGiallo}>✅ +1 pt</Text>
          </View>
        </View>

        {/* ===== MINI CHAT ===== */}
        <Text style={styles.sezioneTitolo}>💬 Chat</Text>
        <View style={{
          backgroundColor: "#111318",
          borderRadius: 16,
          marginHorizontal: 16,
          marginBottom: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#222",
        }}>
          {/* Lista messaggi */}
          <ScrollView
            ref={chatScrollRef}
            style={{ maxHeight: 220, paddingHorizontal: 12, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
          >
            {chatMessages.length === 0 ? (
              <Text style={{ color: "#555", textAlign: "center", paddingVertical: 20, fontSize: 13 }}>
                Nessun messaggio ancora. Scrivi il primo! 🏁
              </Text>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.uid === auth.currentUser?.uid;
                return (
                  <View
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      marginBottom: 10,
                      maxWidth: "80%",
                    }}
                  >
                    {!isMe && (
                      <Text style={{ color: "#ff3b30", fontSize: 11, fontWeight: "700", marginBottom: 2 }}>
                        {msg.username}
                      </Text>
                    )}
                    <View style={{
                      backgroundColor: isMe ? "#ff3b30" : "#1e1e26",
                      borderRadius: 12,
                      borderBottomRightRadius: isMe ? 2 : 12,
                      borderBottomLeftRadius: isMe ? 12 : 2,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}>
                      <Text style={{ color: "white", fontSize: 13 }}>{msg.text}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Input */}
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderTopWidth: 1,
              borderTopColor: "#222",
              gap: 8,
            }}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Scrivi un messaggio..."
                placeholderTextColor="#555"
                onSubmitEditing={handleSendChat}
                returnKeyType="send"
                style={{
                  flex: 1,
                  backgroundColor: "#1e1e26",
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  color: "white",
                  fontSize: 13,
                }}
              />
              <TouchableOpacity
                onPress={handleSendChat}
                style={{
                  backgroundColor: "#ff3b30",
                  borderRadius: 20,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>→</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
        {/* ===== FINE CHAT ===== */}

        <View style={{ height: 30 }} />
      </ScrollView>

      <BottomNav current="Home" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
}