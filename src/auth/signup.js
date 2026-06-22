import { auth, db } from "../services/firebase";
import { createUserProfile } from "../services/userService";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function signup(email, password, username) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await createUserProfile(user, username);

  return user;
}
