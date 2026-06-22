import { db } from "./firebase";

import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const friendshipsRef = collection(db, "friendships");

const usersRef = collection(db, "users");

function mapDocs(snapshot) {
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function getPendingRequests(uid) {
  const q = query(
    friendshipsRef,
    where("users", "array-contains", uid),
    where("status", "==", "pending"),
  );

  const snap = await getDocs(q);

  return mapDocs(snap)
    .filter((f) => f.actionUser !== uid)
    .map((f) => ({
      id: f.id,
      from: f.actionUser,
    }));
}

export async function getSentRequests(uid) {
  const q = query(
    friendshipsRef,
    where("actionUser", "==", uid),
    where("status", "==", "pending"),
  );

  const snap = await getDocs(q);

  return mapDocs(snap);
}

export async function getFriends(uid) {
  const q = query(
    friendshipsRef,
    where("users", "array-contains", uid),
    where("status", "==", "accepted"),
  );

  const snap = await getDocs(q);

  return mapDocs(snap).map((f) => ({
    id: f.id,
    uid: f.users.find((u) => u !== uid),
  }));
}

export async function findUserByCode(code) {
  const q = query(collection(db, "users"), where("friendCode", "==", code));

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data(),
  };
}

export async function sendFriendRequest(myUid, targetUid) {
  if (myUid === targetUid) {
    throw new Error("Non puoi invitare te stesso");
  }

  const friendshipId = [myUid, targetUid].sort().join("_");

  const ref = doc(db, "friendships", friendshipId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();

    if (data.status === "pending") {
      throw new Error("Richiesta già inviata");
    }

    if (data.status === "accepted") {
      throw new Error("Siete già amici");
    }
  }

  await setDoc(doc(db, "friendships", friendshipId), {
    users: [myUid, targetUid],
    status: "pending",
    actionUser: myUid,
    createdAt: serverTimestamp(),
  });

  return true;
}

export async function acceptFriend(friendshipId) {
  await updateDoc(doc(db, "friendships", friendshipId), {
    status: "accepted",
  });

  return true;
}

export async function removeFriend(friendshipId) {
  await deleteDoc(doc(db, "friendships", friendshipId));

  return true;
}
