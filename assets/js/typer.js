/**
 * Placeholder animado del buscador grande: escribe y borra temas reales.
 * Se detiene mientras el campo tiene foco o texto, y respeta «reducir movimiento».
 */
import { prefersReducedMotion } from "./utils.js";

export function initTyper(input, words) {
  if (!input || !words.length) return;
  if (prefersReducedMotion()) {
    input.placeholder = words.slice(0, 3).join(", ") + "…";
    return;
  }
  let w = 0, i = 0, dir = 1, paused = false;
  input.addEventListener("focus", () => (paused = true));
  input.addEventListener("blur", () => (paused = false));

  (function step() {
    if (!paused && !input.value) {
      const word = words[w];
      i += dir;
      input.placeholder = word.slice(0, i);
      if (i >= word.length) { dir = -1; return setTimeout(step, 1600); }
      if (i <= 0) { dir = 1; w = (w + 1) % words.length; return setTimeout(step, 350); }
    }
    setTimeout(step, dir > 0 ? 95 : 40);
  })();
}
