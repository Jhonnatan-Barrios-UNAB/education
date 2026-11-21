/**
 * Estado de la búsqueda y los filtros. Se refleja en la URL
 * (?q=&curso=&tipo=&tema=&vista=&orden=&recurso=) para poder compartir resultados.
 */
import { safeReplaceURL } from "./utils.js";

export const SORTS = ["curso", "recientes", "az", "tipo"];

export const state = { q: "", curso: "", tipo: "", tema: "", vista: "grid", orden: "curso" };

export function readURL(data) {
  const p = new URLSearchParams(location.search);
  state.q = p.get("q") || "";
  state.curso = data.cursos.has(p.get("curso")) ? p.get("curso") : "";
  state.tipo = data.tipos.has(p.get("tipo")) ? p.get("tipo") : "";
  state.tema = p.get("tema") || "";
  state.vista = p.get("vista") === "lista" ? "list" : "grid";
  state.orden = SORTS.includes(p.get("orden")) ? p.get("orden") : "curso";
  return p.get("recurso") || "";
}

export function writeURL(extra = {}) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.curso) p.set("curso", state.curso);
  if (state.tipo) p.set("tipo", state.tipo);
  if (state.tema) p.set("tema", state.tema);
  if (state.vista === "list") p.set("vista", "lista");
  if (state.orden !== "curso") p.set("orden", state.orden);
  Object.entries(extra).forEach(([k, v]) => v && p.set(k, v));
  const qs = p.toString();
  safeReplaceURL((qs ? `?${qs}` : location.pathname) + location.hash);
}

export function resetFilters() {
  state.q = ""; state.curso = ""; state.tipo = ""; state.tema = "";
}

export const hasFilters = () => Boolean(state.q || state.curso || state.tipo || state.tema);
