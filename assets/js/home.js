/**
 * Partes de la página que se construyen desde los datos y no cambian al filtrar:
 * stickers de cursos en el hero, cifras, marquesina de temas y bandas de cursos.
 */
import { $, esc, courseVars, plural } from "./utils.js";

const DICE = '<svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6"><rect x="5" y="5" width="22" height="22" rx="5"/><circle cx="11.5" cy="11.5" r="1.8" fill="currentColor"/><circle cx="20.5" cy="20.5" r="1.8" fill="currentColor"/><circle cx="16" cy="16" r="1.8" fill="currentColor"/></svg>';

export function renderHome({ cursos, tipos, recursos, temas }) {
  const count = (id) => recursos.filter((r) => r.curso === id).length;

  // Stickers de cursos + «Sorpréndeme»
  $("#stickers").innerHTML =
    [...cursos.values()]
      .map((c) => `<button type="button" class="sticker" data-course="${esc(c.id)}" style="background:${esc(c.color)};color:${esc(c.colorTexto)}">${esc(c.corto)}<em>${count(c.id)}</em></button>`)
      .join("") + `<button type="button" class="sticker dice" id="surprise">${DICE}Sorpréndeme</button>`;

  // Cifras del hero
  const jugables = recursos.filter((r) => r.tipo === "juego" || r.tipo === "quiz").length;
  $("#heroStats").innerHTML = `<strong>${recursos.length} recursos</strong> en ${plural(cursos.size, "curso", "cursos")}, de los cuales ${jugables} son juegos y quizzes para jugar en clase.`;

  // Marquesina: los 18 temas más usados, duplicados para el bucle continuo
  const items = temas.slice(0, 18).map(([t]) => `<button type="button" data-tema="${esc(t)}" tabindex="-1">${esc(t)}</button>`).join("");
  $("#ticker").innerHTML = items + items;

  // Bandas de cursos
  $("#bands").innerHTML = [...cursos.values()]
    .map((c) => {
      const list = recursos.filter((r) => r.curso === c.id);
      const mix = [...tipos.values()]
        .map((t) => {
          const n = list.filter((r) => r.tipo === t.id).length;
          return n ? `<span>${n} ${n === 1 ? esc(t.nombre.toLowerCase()) : esc(t.plural)}</span>` : "";
        })
        .join("");
      const dark = /^#?f{3,6}$/i.test(c.colorTexto.replace("#", "")) ? " is-dark" : "";
      return `<div class="band${dark}" style="${courseVars(c)}">
        <div class="wrap">
          <div><p class="who">${esc(c.categoria)}</p><h3>${esc(c.nombre)}</h3></div>
          <div class="info">
            <p>${esc(c.descripcion)}</p>
            <div class="mix">${mix}</div>
            <button type="button" class="btn" data-course="${esc(c.id)}">Ver sus ${list.length} recursos</button>
          </div>
        </div>
      </div>`;
    })
    .join("");
}
