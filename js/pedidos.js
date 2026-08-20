import { db } from "./firebase-config.js";
import {
  ref,
  get,
  push,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const RUTA_PEDIDOS = "Pedidos";

export const ESTADOS_PEDIDO = ["Pendiente", "En preparación", "Listo", "Entregado"];

export async function crearPedido({ mesa, items, subtotal, iva, total }) {
  const mesaLimpia = String(mesa ?? "").trim();

  if (!mesaLimpia) {
    throw new Error("Indica el número o nombre de la mesa.");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("El pedido necesita al menos un plato.");
  }
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("El total del pedido no es válido.");
  }

  const nuevoRef = push(ref(db, RUTA_PEDIDOS));
  await set(nuevoRef, {
    mesa: mesaLimpia,
    items,
    subtotal,
    iva,
    total,
    estado: ESTADOS_PEDIDO[0],
    fecha: new Date().toISOString(),
  });

  return nuevoRef.key;
}
export async function obtenerPedidos() {
  const snapshot = await get(ref(db, RUTA_PEDIDOS));
  return snapshot.exists() ? snapshot.val() : {};
}
export async function actualizarEstadoPedido(id, estado) {
  if (!id) throw new Error("Falta el id del pedido.");
  if (!ESTADOS_PEDIDO.includes(estado)) {
    throw new Error("Estado de pedido no válido.");
  }
  await update(ref(db, `${RUTA_PEDIDOS}/${id}`), { estado });
}