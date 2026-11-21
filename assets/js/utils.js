/**
 * Utilidades compartidas: selección del DOM, escape de HTML,
 * normalización de texto para búsquedas y preferencias del usuario.
 */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

/**
 * Quita tildes y pasa a minúsculas carácter por carácter, de modo que
 * cada posición del texto normalizado coincide con la del original.
 * Eso permite resaltar coincidencias sin perder las tildes.
 */
export const fold = (s) =>
  Array.from(String(s ?? ""))
    .map((ch) => ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().charAt(0) || ch)
    .join("");

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const debounce = (fn, ms = 90) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

/** Cambia la URL sin recargar. En vistas previas (iframe srcdoc) el navegador lo bloquea: se ignora. */
export const safeReplaceURL = (url) => {
  try { history.replaceState(null, "", url); } catch { /* vista previa sin historial */ }
};

/** Variables CSS de color para una tarjeta, banda o ficha de un curso. */
export const courseVars = (curso) => `--cc:${curso.color};--on:${curso.colorTexto}`;

export const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
