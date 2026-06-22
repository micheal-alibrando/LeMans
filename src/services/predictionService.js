import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { RACE_RESULTS, GARE } from "../data";

function getRaceById(raceId) {
  return GARE.find((race) => race.slug === raceId || race.id === raceId);
}

function isRaceClosed(raceId) {
  const race = getRaceById(raceId);
  if (!race || !race.data) return false;
  return Date.now() > new Date(race.data).getTime();
}

function calculatePredictionPoints(raceId, { primo, secondo, terzo }) {
  const results = RACE_RESULTS[raceId];
  if (!results) return 0;

  let points = 0;
  if (primo?.id === results.primo.id) points += 10;
  if (secondo?.id === results.secondo.id) points += 7;
  if (terzo?.id === results.terzo.id) points += 5;
  return points;
}

async function scorePendingPrediction(userId, raceId, prediction) {
  const pointsEarned = calculatePredictionPoints(raceId, prediction);
  const previousPoints = prediction.pointsEarned || 0;
  const diff = pointsEarned - previousPoints;

  await updateDoc(doc(db, "predictions", `${userId}_${raceId}`), {
    pointsEarned,
    status: "scored",
    scoredAt: serverTimestamp(),
  });

  if (diff !== 0) {
    await updateDoc(doc(db, "users", userId), {
      points: increment(diff),
    });
  }

  return pointsEarned;
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
  const raceClosed = isRaceClosed(raceId);
  const pointsEarned = raceClosed
    ? calculatePredictionPoints(raceId, { primo, secondo, terzo })
    : 0;
  const status = raceClosed ? "scored" : "pending";

  await setDoc(
    doc(db, "predictions", predictionId),
    {
      userId,
      raceId,
      primo,
      secondo,
      terzo,
      pointsEarned,
      status,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (raceClosed) {
    const diff = pointsEarned - (previousPointsEarned || 0);
    if (diff !== 0) {
      await updateDoc(doc(db, "users", userId), {
        points: increment(diff),
      });
    }
  }

  return pointsEarned;
}

export async function loadPrediction(userId, raceId) {
  const predictionId = `${userId}_${raceId}`;
  const predictionDoc = await getDoc(doc(db, "predictions", predictionId));
  if (!predictionDoc.exists()) return null;

  const prediction = predictionDoc.data();
  if (prediction.status === "pending" && isRaceClosed(raceId)) {
    const pointsEarned = await scorePendingPrediction(userId, raceId, prediction);
    return { ...prediction, pointsEarned, status: "scored" };
  }

  return prediction;
}
