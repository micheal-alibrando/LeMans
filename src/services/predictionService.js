import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function savePrediction(userId, raceId, primo, secondo, terzo) {
  const predictionId = `${userId}_${raceId}`;

  await setDoc(
    doc(db, "predictions", predictionId),
    {
      userId,
      raceId,
      primo,
      secondo,
      terzo,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loadPrediction(userId, raceId) {
  const predictionId = `${userId}_${raceId}`;
  const predictionDoc = await getDoc(doc(db, "predictions", predictionId));
  if (!predictionDoc.exists()) return null;
  return predictionDoc.data();
}
