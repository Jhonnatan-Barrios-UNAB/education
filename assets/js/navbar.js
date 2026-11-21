/**
 * Menú fijo: mide su altura (para que la barra del catálogo quede justo debajo)
 * y cambia de estilo cuando la página pasa el hero.
 */
import { $ } from "./utils.js";

export function initNavbar() {
  const nav = $("#navbar");
  const hero = $("#inicio");

  const measure = () => document.documentElement.style.setProperty("--navh", `${nav.offsetHeight}px`);
  const update = () => {
    const past = hero.getBoundingClientRect().bottom <= nav.offsetHeight + 4;
    nav.dataset.state = past ? "scrolled" : "hero";
  };

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", () => { measure(); update(); });
  measure();
  update();
}
