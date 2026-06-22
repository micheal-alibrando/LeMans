import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0000",
  },
  homeContainer: {
    flex: 1,
    backgroundColor: "#0b0b0f",
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },

  // === ONBOARDING & LOGIN ===
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loginContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 20,
  },
  car: {
    width: 600,
    height: 200,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    width: "85%",
    backgroundColor: "#ff0000",
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff0000",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "#330000",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#ff0000",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    marginTop: 30,
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
  },

  // === HOME ===
  headerCard: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#14141a",
  },
  ciao: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  garaCard: {
    marginTop: 16,
    backgroundColor: "#1a1a22",
    borderRadius: 18,
    padding: 18,
  },
  garaBadge: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.9,
  },
  garaTitolo: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
  garaTimer: {
    color: "#ff4d4d",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    fontVariant: ["tabular-nums"],
  },
  bottonePrevisione: {
    marginTop: 16,
    backgroundColor: "#ff3b30",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  testoBottonePrevisione: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  sezioneTitolo: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a22",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  statNumero: {
    color: "#ffd60a",
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: "#b5b5b5",
    fontSize: 12,
    marginTop: 4,
  },
  garaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1a22",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  garaRound: {
    color: "#ffffff",
    fontWeight: "700",
  },
  garaCircuito: {
    color: "#9a9a9a",
    marginTop: 4,
    fontSize: 13,
  },
  garaDestra: {
    alignItems: "flex-end",
  },
  garaPosizione: {
    color: "#ffffff",
    fontSize: 13,
  },
  garaPuntiVerde: {
    color: "#34c759",
    fontWeight: "700",
    marginTop: 4,
  },
  garaPuntiGiallo: {
    color: "#ffd60a",
    fontWeight: "700",
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#14141a",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 26,
  },
  navLabel: {
    color: "#8a8a8a",
    fontSize: 11,
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#ff3b30",
    fontWeight: "700",
  },

  // === GARE ===
  headerSimple: {
    marginTop: 10,
    paddingVertical: 16,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  garaCardBig: {
    backgroundColor: "#1a1a22",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  garaNome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  garaData: {
    color: "#9a9a9a",
    marginTop: 6,
    fontSize: 13,
  },
  garaButton: {
    marginTop: 12,
    backgroundColor: "#ff3b30",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  garaButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  dropdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  detailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailText: {
    color: "#b5b5b5",
    marginBottom: 4,
    fontSize: 13,
  },

  // === PREVISIONE ===
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginTop: 10,
  },
  backArrow: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  predictionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  posizioniIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },
  posizioneBox: {
    flex: 1,
    backgroundColor: "#1a1a22",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  posizioneBoxAttiva: {
    borderColor: "#ff3b30",
  },
  posizioneBoxCompiuta: {
    backgroundColor: "#2a2a35",
    borderColor: "#34c759",
  },
  posizioneBoxLabel: {
    color: "#ff3b30",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  posizioneBoxNome: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  selezioneGuida: {
    color: "#b5b5b5",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  pilotiList: {
    paddingBottom: 20,
  },
  pilotaCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a22",
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  pilotaSelezionato: {
    backgroundColor: "#2a1a1a",
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  pilotaInfo: {
    flex: 1,
  },
  pilotaNumero: {
    color: "#ff3b30",
    fontSize: 12,
    fontWeight: "700",
  },
  pilotaNome: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  pilotaTeam: {
    color: "#9a9a9a",
    fontSize: 12,
    marginTop: 2,
  },
  posizioneBadge: {
    backgroundColor: "#ff3b30",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  posizioneBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  bottoneConferma: {
    backgroundColor: "#34c759",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  bottoneConfermaDisabilitato: {
    backgroundColor: "#1a1a22",
  },
  testoBottoneConferma: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  googleLogo: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: -4,
    marginBottom: 2,
  },
  link: {
    color: "#ccc",
    marginTop: 20,
    textAlign: "center",
  },
  field: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    textAlign: "left",
    alignSelf: "flex-start",
  },
});
