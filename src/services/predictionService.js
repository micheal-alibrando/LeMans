import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { RACE_RESULTS } from "../data";

function calculatePredictionPoints(raceId, { primo, secondo, terzo }) {
  const results = RACE_RESULTS[raceId];
  if (!results) return 0;

  let points = 0;
  if (primo?.id === results.primo.id) points += 10;
  if (secondo?.id === results.secondo.id) points += 7;
  if (terzo?.id === results.terzo.id) points += 5;
  return points;
}

export async function savePrediction(
  userId,
  raceId,
  primo,
  secondo,
  terzo,
  previousPointsEarned = 0,
) {
  const predictionId = `${userId}_${raceId}`;
  const pointsEarned = calculatePredictionPoints(raceId, {
    primo,
    secondo,
    terzo,
  });

  await setDoc(
    doc(db, "predictions", predictionId),
    {
      userId,
      raceId,
      primo,
      secondo,
      terzo,
      pointsEarned,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  const diff = pointsEarned - (previousPointsEarned || 0);
  if (diff !== 0) {
    await updateDoc(doc(db, "users", userId), {
      points: increment(diff),
    });
  }

  return pointsEarned;
}

export async function loadPrediction(userId, raceId) {
  const predictionId = `${userId}_${raceId}`;
  const predictionDoc = await getDoc(doc(db, "predictions", predictionId));
  if (!predictionDoc.exists()) return null;
  return predictionDoc.data();
}
