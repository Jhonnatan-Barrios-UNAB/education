/**
 * Catálogo: filtros con conteos, resultados en fichas o lista,
 * estado vacío y aviso de coincidencias en el buscador grande.
 */
import { state, writeURL, hasFilters } from "./state.js";
import { matches, sortList, highlight } from "./search.js";
import { $, $$, esc, courseVars, prefersReducedMotion, plural } from "./utils.js";
import { icon } from "./icons.js";

let DATA = null;
let lastList = [];

export const currentList = () => lastList;

export function initCatalog(data) {
  DATA = data;
}

function chip(label, value, current, count, color) {
  const on = current === value;
  const sw = color ? `<span class="sw" style="background:${esc(color)}"></span>` : "";
  return `<button type="button" class="chip" data-val="${esc(value)}" aria-pressed="${on}" ${!on && count === 0 ? "disabled" : ""}>${sw}${esc(label)}<i>${count}</i></button>`;
}

function renderFilters() {
  const { recursos, cursos, tipos, temas } = DATA;

  const baseC = recursos.filter((r) => matches(r, "curso"));
  $("#fCourse").innerHTML =
    chip("Todos", "", state.curso, baseC.length) +
    [...cursos.values()].map((c) => chip(c.corto, c.id, state.curso, baseC.filter((r) => r.curso === c.id).length, c.color)).join("");

  const baseT = recursos.filter((r) => matches(r, "tipo"));
  $("#fType").innerHTML =
    chip("Todos", "", state.tipo, baseT.length) +
    [...tipos.values()].map((t) => chip(t.nombre, t.id, state.tipo, baseT.filter((r) => r.tipo === t.id).length)).join("");

  const baseM = recursos.filter((r) => matches(r, "tema"));
  $("#fTema").innerHTML =
    `<option value="">Todos los temas</option>` +
    temas
      .map(([t]) => {
        const n = baseM.filter((r) => r.temas.includes(t)).length;
        return n || state.tema === t ? `<option value="${esc(t)}" ${state.tema === t ? "selected" : ""}>${esc(t)} (${n})</option>` : "";
      })
      .join("");

  $("#resetAll").hidden = !hasFilters();
}

function card(r) {
  const c = r.cursoObj;
  return `<article class="card" style="${courseVars(c)}">
    <span class="tab">${esc(c.corto)}${r.nuevo ? '<span class="new">Nuevo</span>' : ""}</span>
    <div class="sheet">
      <div class="top">
        <div class="kind">${esc(r.tipoObj.nombre)}<small>${r.semana ? "Semana " + esc(r.semana) : "&nbsp;"}</small></div>
        <div class="glyph" aria-hidden="true">${icon(r.tipoObj.icono)}</div>
      </div>
      <h3><button type="button" data-open="${esc(r.id)}">${highlight(r.titulo)}</button></h3>
      <p class="d">${highlight(r.descripcion)}</p>
      <div class="tags">${r.temas.map((t) => `<button type="button" class="tag" data-tema="${esc(t)}" aria-label="Filtrar por ${esc(t)}">${highlight(t)}</button>`).join("")}</div>
    </div>
  </article>`;
}

function row(r) {
  return `<button type="button" class="row" data-open="${esc(r.id)}" style="${courseVars(r.cursoObj)}">
    <span class="bar" aria-hidden="true"></span>
    <span class="t">${highlight(r.titulo)}<small>${esc(r.temas.join(", "))}</small></span>
    <span class="m">${esc(r.cursoObj.corto)}</span>
    <span class="m">${esc(r.tipoObj.nombre)}</span>
    <span class="m">${r.semana ? "Semana " + esc(r.semana) : ""}</span>
  </button>`;
}

function renderResults() {
  const list = sortList(DATA.recursos.filter((r) => matches(r)));
  lastList = list;
  $("#count").innerHTML = `<b>${list.length}</b> ${list.length === 1 ? "recurso" : "recursos"}`;

  if (!list.length) {
    const sugg = DATA.temas.slice(0, 4).map(([t]) => t);
    $("#results").innerHTML = `<div class="empty">
      <h3>Nada por aquí con esos filtros.</h3>
      <p>${state.q ? `No encontré «${esc(state.q)}». ` : ""}Prueba con otro tema o quita los filtros para ver todo el catálogo.</p>
      <div class="chips">${sugg.map((s) => `<button type="button" class="chip" data-suggest="${esc(s)}">${esc(s)}</button>`).join("")}</div>
      <button type="button" class="btn" data-reset>Quitar filtros</button></div>`;
    return;
  }
  $("#results").innerHTML =
    state.vista === "list" ? `<div class="list">${list.map(row).join("")}</div>` : `<div class="grid">${list.map(card).join("")}</div>`;
}

function renderHeroHint() {
  const el = $("#heroHint");
  if (!state.q) { el.innerHTML = ""; return; }
  const n = DATA.recursos.filter((r) => matches(r)).length;
  el.innerHTML = n
    ? `<span>${plural(n, "recurso coincide", "recursos coinciden")}.</span><button type="button" data-goto>Ver resultados</button>`
    : `<span>Sin coincidencias. Prueba con otra palabra.</span>`;
}

function syncControls() {
  if ($("#q").value !== state.q) $("#q").value = state.q;
  if ($("#heroQ").value !== state.q) $("#heroQ").value = state.q;
  $("#miniWrap").classList.toggle("has-value", Boolean(state.q));
  $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.vista)));
  $("#sort").value = state.orden;
}

export function render(animate = false) {
  const run = () => { syncControls(); renderFilters(); renderResults(); renderHeroHint(); writeURL(); };
  if (animate && document.startViewTransition && !prefersReducedMotion()) document.startViewTransition(run);
  else run();
}

export function renderError(err) {
  console.error(err);
  $("#results").innerHTML = `<div class="empty">
    <h3>No se pudo cargar el catálogo.</h3>
    <p>Los datos están en la carpeta <b>data/</b> y se leen con <code>fetch</code>, así que la página necesita abrirse desde un servidor (GitHub Pages o un servidor local), no con doble clic sobre el archivo. Revisa el README para verlo en tu equipo.</p>
  </div>`;
  $("#count").textContent = "";
}

export function toCatalog() {
  $("#catalogo").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
