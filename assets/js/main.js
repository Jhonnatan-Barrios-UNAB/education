/**
 * Punto de entrada. Carga los datos, pinta la página y conecta los eventos.
 */
import { $, $$, debounce } from "./utils.js";
import { loadData } from "./data.js";
import { state, readURL, resetFilters } from "./state.js";
import { initCatalog, render, renderError, toCatalog, currentList } from "./catalog.js";
import { renderHome } from "./home.js";
import { initNavbar } from "./navbar.js";
import { initDialogs, openResource, closeResource, openAbout, closeAbout, toast, isAnyDialogOpen } from "./dialogs.js";
import { initTyper } from "./typer.js";

/* Palabras que «escribe» el buscador grande. Cámbialas cuando quieras. */
const TYPER_WORDS = ["netiqueta", "storyboard", "networking", "derechos de autor", "infografías", "seguridad digital", "storytelling", "IA generativa", "huella digital", "fotografía"];

/* Un recurso cuenta como «Nuevo» durante estos días desde su fecha. */
const NUEVO_DIAS = 21;

let DATA = null;
const byId = (id) => DATA?.recursos.find((r) => r.id === id);

function bindEvents() {
  const typed = debounce(() => render(false), 90);
  $("#q").addEventListener("input", (e) => { state.q = e.target.value; typed(); });
  $("#heroQ").addEventListener("input", (e) => { state.q = e.target.value; typed(); });
  $("#heroForm").addEventListener("submit", (e) => { e.preventDefault(); state.q = $("#heroQ").value; render(false); toCatalog(); });
  $("#clearQ").addEventListener("click", () => { state.q = ""; render(false); $("#q").focus(); });
  $("#sort").addEventListener("change", (e) => { state.orden = e.target.value; render(true); });
  $("#fTema").addEventListener("change", (e) => { state.tema = e.target.value; render(true); });
  $("#resetAll").addEventListener("click", () => { resetFilters(); render(true); });
  $$(".seg button").forEach((b) => b.addEventListener("click", () => { state.vista = b.dataset.view; render(true); }));
  $("#fCourse").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.curso = state.curso === b.dataset.val ? "" : b.dataset.val; render(true);
  });
  $("#fType").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    state.tipo = state.tipo === b.dataset.val ? "" : b.dataset.val; render(true);
  });

  // Delegación: un solo listener para todos los botones con data-*
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-about],[data-close-about],[data-goto-catalog],[data-open],[data-tema],[data-course],[data-reset],[data-suggest],[data-goto],[data-close],[data-share],[data-more],#surprise");
    if (!t) return;
    const d = t.dataset;

    if ("about" in d) return openAbout();
    if ("closeAbout" in d) return closeAbout();
    if ("gotoCatalog" in d) { closeAbout(); return toCatalog(); }
    if (!DATA) return;

    if (t.id === "surprise") {
      const pool = currentList().length ? currentList() : DATA.recursos;
      return openResource(pool[Math.floor(Math.random() * pool.length)]);
    }
    if ("open" in d) return openResource(byId(d.open));
    if ("tema" in d) { state.tema = d.tema; render(true); if (!t.closest(".grid")) toCatalog(); return; }
    if ("course" in d) { state.curso = d.course; render(true); return toCatalog(); }
    if ("reset" in d) { resetFilters(); return render(true); }
    if ("suggest" in d) { resetFilters(); state.q = d.suggest; return render(true); }
    if ("goto" in d) return toCatalog();
    if ("close" in d) return closeResource();
    if ("share" in d) {
      const url = new URL(location.href);
      url.search = `?recurso=${encodeURIComponent(d.share)}`;
      url.hash = "";
      const text = url.href.startsWith("http") ? url.href : d.share;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(() => toast("Enlace copiado"))
        .catch(() => toast(text));
      return;
    }
    if ("more" in d) { resetFilters(); state.tema = d.more; closeResource(); render(true); return toCatalog(); }
  });

  // Atajos: «/» enfoca el buscador; Esc borra la búsqueda
  document.addEventListener("keydown", (e) => {
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || "");
    if (e.key === "/" && !typing && !isAnyDialogOpen()) { e.preventDefault(); $("#q").focus({ preventScroll: true }); toCatalog(); }
    if (e.key === "Escape" && document.activeElement === $("#q") && state.q) { state.q = ""; render(false); }
  });
}

async function init() {
  initNavbar();
  initDialogs();
  initTyper($("#heroQ"), TYPER_WORDS);
  bindEvents();
  if (location.hash === "#sobre-mi") openAbout();

  try {
    DATA = await loadData({ nuevoDias: NUEVO_DIAS });
  } catch (err) {
    renderError(err);
    return;
  }
  initCatalog(DATA);
  renderHome(DATA);
  const recursoInicial = readURL(DATA);
  render(false);
  if (recursoInicial && byId(recursoInicial)) openResource(byId(recursoInicial));
}

init();
