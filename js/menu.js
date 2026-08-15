// js/menu.js
// -----------------------------------------------------------------------------
// Responsabilidad única: acceso a datos del menú en Realtime Database.
// No toca el DOM. Valida sus propias entradas para no depender de que
// cada vista valide correctamente (defensa en profundidad).
// -----------------------------------------------------------------------------
import { db } from "./firebase-config.js";
import {
  ref,
  get,
  push,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// IMPORTANTE: en la consola de Firebase los datos de prueba quedaron cargados
// bajo el nodo "Plaintext" con los campos { id, name, price } (inglés), no
// bajo "menu" con { nombre, precio } como se asumió en la primera versión.
// Este archivo ahora apunta a lo que REALMENTE existe en la base de datos.
//
// Recomendado (opcional, no bloqueante): renombrar el nodo "Plaintext" a
// "menu" desde la consola (Realtime Database > Datos > menú "⋮" > Importar
// JSON) para que el nombre sea más claro. Si lo haces, solo cambia la
// constante de abajo — el resto del código no se toca.
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

export async function eliminarPlato(id) {
  if (!id) throw new Error("Falta el id del plato a eliminar.");
  await remove(ref(db, `${RUTA_MENU}/${id}`));
}