import { db } from "./firebase-config.js";
import {
  ref,
  get,
  push,
  set,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const RUTA_STOCK = "Stock";

export const CATEGORIAS_STOCK = [
  "Comida rápida",
  "Almuerzo",
  "Cena elegante",
  "General",
];

export const UNIDADES_STOCK = ["unidades", "g", "kg", "ml", "l"];

export async function obtenerStock() {
  const snapshot = await get(ref(db, RUTA_STOCK));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function agregarIngrediente(nombre, cantidad, unidad, categoria) {
  const nombreLimpio = String(nombre ?? "").trim();
  const cantidadNumerica = Number(cantidad);

  if (!nombreLimpio) {
    throw new Error("El nombre del ingrediente no puede estar vacío.");
  }
  if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0) {
    throw new Error("La cantidad debe ser un número igual o mayor a 0.");
  }
  if (!UNIDADES_STOCK.includes(unidad)) {
    throw new Error("Selecciona una unidad de medida válida.");
  }
  if (!CATEGORIAS_STOCK.includes(categoria)) {
    throw new Error("Selecciona una categoría válida.");
  }

  const nuevoRef = push(ref(db, RUTA_STOCK));
  await set(nuevoRef, {
    nombre: nombreLimpio,
    cantidad: cantidadNumerica,
    unidad,
    categoria,
  });

  return nuevoRef.key;
}

export async function actualizarCantidad(id, nuevaCantidad) {
  if (!id) throw new Error("Falta el id del ingrediente.");
  const cantidadNumerica = Number(nuevaCantidad);
  if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0) {
    throw new Error("La cantidad debe ser un número igual o mayor a 0.");
  }
  await update(ref(db, `${RUTA_STOCK}/${id}`), { cantidad: cantidadNumerica });
}

export async function eliminarIngrediente(id) {
  if (!id) throw new Error("Falta el id del ingrediente a eliminar.");
  await remove(ref(db, `${RUTA_STOCK}/${id}`));
}