
import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


export function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function cerrarSesion() {
  return signOut(auth);
}


export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback);
}

export function mensajeErrorAuth(error) {
  const codigo = error?.code || "";
  const mapa = {
    "auth/invalid-email": "El correo ingresado no es válido.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  };
  return mapa[codigo] || "No se pudo iniciar sesión. Intenta nuevamente.";
}