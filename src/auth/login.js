import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
}
