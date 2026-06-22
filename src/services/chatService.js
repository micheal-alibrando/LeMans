import { db } from "./firebase";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore";

export function subscribeToChat(callback, limitN = 30) {
  const q = query(collection(db, "chat"), orderBy("createdAt", "desc"), limit(limitN));
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() })).reverse();
    callback(msgs);
  });
}

export async function sendMessage(uid, username, text) {
  await addDoc(collection(db, "chat"), {
    uid, username, text,
    createdAt: serverTimestamp(),
  });
}