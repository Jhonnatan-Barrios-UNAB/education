/**
 * Diálogos: ficha de cada recurso y popup «Sobre mí» (con pestañas).
 */
import { $, $$, esc, courseVars, safeReplaceURL } from "./utils.js";
import { writeURL } from "./state.js";

/* ---------------- Ficha de recurso ---------------- */
const CLOSE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';

let resourceReturn = null;

export function openResource(r) {
  if (!r) return;
  const dlg = $("#dlg");
  const c = r.cursoObj;
  resourceReturn = document.activeElement;
  dlg.setAttribute("style", courseVars(c));
  dlg.innerHTML = `<div class="dlg-head">
      <span class="course">${esc(c.nombre)}</span>
      <h2 id="dlgTitle">${esc(r.titulo)}</h2>
      <button type="button" class="x" data-close aria-label="Cerrar ficha">${CLOSE_ICON}</button>
    </div>
    <div class="dlg-body">
      <p>${esc(r.descripcion)}</p>
      <dl class="dlg-meta">
        <dt>Tipo</dt><dd>${esc(r.tipoObj.nombre)}</dd>
        <dt>Curso</dt><dd>${esc(c.nombre)}</dd>
        ${r.semana ? `<dt>Semana</dt><dd>${esc(r.semana)}</dd>` : ""}
        <dt>Temas</dt><dd>${esc(r.temas.join(", "))}</dd>
        <dt>Autoría</dt><dd>Recurso educativo de creación propia</dd>
      </dl>
      <div class="dlg-actions">
        <a class="btn" href="${esc(r.enlace)}" target="_blank" rel="noopener">Abrir recurso</a>
        <button type="button" class="btn light" data-share="${esc(r.id)}">Copiar enlace de la ficha</button>
        ${r.temas[0] ? `<button type="button" class="btn light" data-more="${esc(r.temas[0])}">Ver más de ${esc(r.temas[0])}</button>` : ""}
      </div>
    </div>`;
  dlg.showModal();
  writeURL({ recurso: r.id });
}

export function closeResource() {
  const dlg = $("#dlg");
  if (dlg.open) dlg.close();
}

function initResourceDialog() {
  const dlg = $("#dlg");
  dlg.addEventListener("close", () => {
    writeURL();
    resourceReturn?.focus?.({ preventScroll: true });
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

/* ---------------- Popup Sobre mí ---------------- */
let aboutReturn = null;

function selectTab(tab, focus) {
  $$('#about [role="tab"]').forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    if (on && focus) t.focus();
  });
  $(".about-panels").scrollTop = 0;
}

export function openAbout() {
  const about = $("#about");
  if (about.open) return;
  aboutReturn = document.activeElement;
  selectTab($("#t-perfil"), false);
  about.showModal();
  if (location.hash !== "#sobre-mi") safeReplaceURL(location.pathname + location.search + "#sobre-mi");
}

export function closeAbout() {
  const about = $("#about");
  if (about.open) about.close();
}

function initAboutDialog() {
  const about = $("#about");
  about.addEventListener("close", () => {
    if (location.hash === "#sobre-mi") safeReplaceURL(location.pathname + location.search);
    aboutReturn?.focus?.({ preventScroll: true });
  });
  about.addEventListener("click", (e) => { if (e.target === about) about.close(); });

  const tabs = $$('#about [role="tab"]');
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t, false));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      selectTab(next, true);
    });
  });

  addEventListener("hashchange", () => { if (location.hash === "#sobre-mi") openAbout(); });
}

/* ---------------- Aviso breve ---------------- */
export function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 1800);
}

export const isAnyDialogOpen = () => $("#dlg").open || $("#about").open;

export function initDialogs() {
  initResourceDialog();
  initAboutDialog();
}
