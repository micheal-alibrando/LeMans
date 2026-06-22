import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function createUserProfile(user, username) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    username: username.toLowerCase().trim(),
    photo: user.photoURL || "",
    friendCode: user.uid.slice(0, 8),
    points: 0,
    wins: 0,
    losses: 0,
    winStreak: 0,
    createdAt: serverTimestamp(),
  });
}

export async function isUsernameTaken(username) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase()),
  );

  const snap = await getDocs(q);

  return !snap.empty;
}
