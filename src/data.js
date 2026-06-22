const PILOTI = [
  { id: "1", nome: "Kobayashi", numero: "7", team: "Toyota" },
  { id: "2", nome: "Conway", numero: "7", team: "Toyota" },
  { id: "3", nome: "Lopez", numero: "7", team: "Toyota" },
  { id: "4", nome: "Buemi", numero: "8", team: "Toyota" },
  { id: "5", nome: "Hartley", numero: "8", team: "Toyota" },
  { id: "6", nome: "Hirakawa", numero: "8", team: "Toyota" },
  { id: "7", nome: "Nakajima", numero: "36", team: "Alpine" },
  { id: "8", nome: "Lapierre", numero: "36", team: "Alpine" },
  { id: "9", nome: "Vaxiviere", numero: "36", team: "Alpine" },
  { id: "10", nome: "Frijns", numero: "31", team: "WRT" },
  { id: "11", nome: "Habsburg", numero: "31", team: "WRT" },
  { id: "12", nome: "Milesi", numero: "31", team: "WRT" },
  { id: "13", nome: "Rast", numero: "28", team: "JOTA" },
  { id: "14", nome: "Ilott", numero: "28", team: "JOTA" },
  { id: "15", nome: "Stevens", numero: "28", team: "JOTA" },
];

const GARE = [
  {
    id: "1",
    slug: "6h-spa",
    nome: "6h Spa",
    data: "2026-05-10T14:00:00",
    circuito: "Spa-Francorchamps",
    km: "7.004",
    curve: 19,
    tipo: "Alta velocità",
    temp: 18,
    meteo: "Variabile",
    vento: 15,
  },
  {
    id: "2",
    slug: "24h-le-mans",
    nome: "24h Le Mans",
    data: "2026-06-13T15:00:00",
    circuito: "Circuit de la Sarthe",
    km: "13.626",
    curve: 8,
    tipo: "Resistenza",
    temp: 22,
    meteo: "Soleggiato",
    vento: 10,
  },
  {
    id: "3",
    slug: "6h-fuji",
    nome: "6h Fuji",
    data: "2026-09-20T11:00:00",
    circuito: "Fuji Speedway",
    km: "4.563",
    curve: 16,
    tipo: "Equilibrato",
    temp: 24,
    meteo: "Sereno",
    vento: 8,
  },
];

const RACE_RESULTS = {
  "24h-le-mans": {
    primo: { id: "1", nome: "Kobayashi", numero: "7", team: "Toyota" },
    secondo: { id: "10", nome: "Frijns", numero: "31", team: "WRT" },
    terzo: { id: "13", nome: "Rast", numero: "28", team: "JOTA" },
  },
};

export { PILOTI, GARE, RACE_RESULTS };
