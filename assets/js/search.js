/**
 * Búsqueda: coincidencia por términos (sin tildes), filtros facetados,
 * orden y resaltado de coincidencias.
 */
import { state } from "./state.js";
import { esc, fold } from "./utils.js";

export const terms = () => fold(state.q).split(/\s+/).filter(Boolean);

/** ¿El recurso pasa los filtros? `skip` ignora una faceta para calcular sus conteos. */
export function matches(r, skip) {
  if (skip !== "curso" && state.curso && r.curso !== state.curso) return false;
  if (skip !== "tipo" && state.tipo && r.tipo !== state.tipo) return false;
  if (skip !== "tema" && state.tema && !r.temas.includes(state.tema)) return false;
  return terms().every((t) => r.hay.includes(t));
}

export function sortList(list) {
  const l = list.slice();
  const byCourse = (a, b) => a.cursoObj.orden - b.cursoObj.orden;
  switch (state.orden) {
    case "az":
      return l.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    case "recientes":
      return l.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "") || a.idx - b.idx);
    case "tipo":
      return l.sort((a, b) => a.tipoObj.orden - b.tipoObj.orden || byCourse(a, b) || a.idx - b.idx);
    default:
      return l.sort((a, b) => byCourse(a, b) || (a.semana || 99) - (b.semana || 99) || a.idx - b.idx);
  }
}

/** Devuelve HTML escapado con <mark> en las coincidencias, conservando tildes. */
export function highlight(text) {
  const ts = terms();
  const src = String(text);
  if (!ts.length) return esc(src);
  const chars = Array.from(src);
  const f = fold(src);
  const marks = new Array(chars.length).fill(false);
  ts.forEach((t) => {
    let i = f.indexOf(t);
    while (i > -1) {
      for (let j = i; j < i + t.length; j++) marks[j] = true;
      i = f.indexOf(t, i + t.length);
    }
  });
  let out = "";
  let open = false;
  chars.forEach((ch, i) => {
    if (marks[i] && !open) { out += "<mark>"; open = true; }
    if (!marks[i] && open) { out += "</mark>"; open = false; }
    out += esc(ch);
  });
  return out + (open ? "</mark>" : "");
}
