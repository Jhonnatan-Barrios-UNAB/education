/**
 * Carga y prepara los datos del catálogo (carpeta data/).
 * - cursos.json: cursos y formaciones, con su color.
 * - tipos.json: tipos de recurso, con su icono.
 * - recursos.json: el catálogo.
 * Valida referencias para avisar en consola si un recurso apunta a un curso o tipo que no existe.
 */
import { fold } from "./utils.js";

const DATA_URL = new URL("../../data/", import.meta.url);

async function getJSON(name) {
  const res = await fetch(new URL(name, DATA_URL), { cache: "no-cache" });
  if (!res.ok) throw new Error(`No se pudo leer data/${name} (${res.status})`);
  return res.json();
}

/** Días desde la fecha del recurso; sirve para la etiqueta «Nuevo». */
const daysSince = (iso) => (Date.now() - new Date(iso + "T00:00:00").getTime()) / 86400000;

export async function loadData({ nuevoDias = 21 } = {}) {
  const [cursosArr, tiposArr, recursosArr] = await Promise.all([
    getJSON("cursos.json"),
    getJSON("tipos.json"),
    getJSON("recursos.json"),
  ]);

  const cursos = new Map(cursosArr.map((c, i) => [c.id, { ...c, orden: i }]));
  const tipos = new Map(tiposArr.map((t, i) => [t.id, { ...t, orden: i }]));

  const ids = new Set();
  const recursos = [];
  recursosArr.forEach((r, i) => {
    const curso = cursos.get(r.curso);
    const tipo = tipos.get(r.tipo);
    if (!curso || !tipo) {
      console.warn(`[catálogo] Recurso «${r.titulo}» omitido: curso «${r.curso}» o tipo «${r.tipo}» no existe.`);
      return;
    }
    if (ids.has(r.id)) console.warn(`[catálogo] id repetido: «${r.id}». Usa un id único por recurso.`);
    ids.add(r.id);
    const temas = Array.isArray(r.temas) ? r.temas : [];
    recursos.push({
      ...r,
      temas,
      idx: i,
      cursoObj: curso,
      tipoObj: tipo,
      nuevo: r.fecha ? daysSince(r.fecha) <= nuevoDias : false,
      hay: fold([r.titulo, r.descripcion, temas.join(" "), curso.nombre, tipo.nombre, r.semana ? `semana ${r.semana}` : ""].join(" ")),
    });
  });

  // Temas ordenados por frecuencia (para el filtro y la marquesina)
  const freq = new Map();
  recursos.forEach((r) => r.temas.forEach((t) => freq.set(t, (freq.get(t) || 0) + 1)));
  const temas = [...freq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));

  return { cursos, tipos, recursos, temas };
}
