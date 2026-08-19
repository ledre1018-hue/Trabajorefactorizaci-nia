import { db } from "./firebase-config.js";
import {
  ref,
  get,
  push,
  set,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


const RUTA_MENU = "Plaintext";

export async function obtenerMenu() {
  const snapshot = await get(ref(db, RUTA_MENU));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function agregarPlato(nombre, precio) {
  const nombreLimpio = String(nombre ?? "").trim();
  const precioNumerico = Number(precio);

  if (!nombreLimpio) {
    throw new Error("El nombre del plato no puede estar vacío.");
  }
  if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
    throw new Error("El precio debe ser un número mayor a 0.");
  }

  const nuevoPlatoRef = push(ref(db, RUTA_MENU));
  await set(nuevoPlatoRef, {
    name: nombreLimpio,
    price: precioNumerico,
  });

  return nuevoPlatoRef.key;
}

export async function actualizarPrecio(id, nuevoPrecio) {
  if (!id) throw new Error("Falta el id del plato a actualizar.");
  const precioNumerico = Number(nuevoPrecio);
  if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
    throw new Error("El precio debe ser un número mayor a 0.");
  }
  await update(ref(db, `${RUTA_MENU}/${id}`), { price: precioNumerico });
}

export async function eliminarPlato(id) {
  if (!id) throw new Error("Falta el id del plato a eliminar.");
  await remove(ref(db, `${RUTA_MENU}/${id}`));
}