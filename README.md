# Recursos educativos · Jhonnatan Barrios

Portafolio y catálogo de recursos educativos de creación propia: presentaciones, juegos de clase, quizzes, guías, plantillas y ejemplos visuales para enseñar competencias digitales.

Sitio publicado: <https://jhonnatan-barrios-unab.github.io/education/>

Es un sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación. Los recursos se leen de archivos JSON, así que **agregar contenido no exige tocar el código**.

---

## Estructura

```
education/
├── index.html              Estructura de la página (menú, hero, catálogo, cursos, contacto, popups)
├── data/                   ← Aquí se actualiza el contenido
│   ├── recursos.json       El catálogo: un objeto por recurso
│   ├── cursos.json         Cursos y formaciones, con su color
│   └── tipos.json          Tipos de recurso, con su icono
├── assets/
│   ├── css/
│   │   ├── base.css        Fuente, colores (tokens) y estilos generales
│   │   ├── navbar.css      Menú fijo
│   │   ├── hero.css        Portada, buscador grande y marquesina de temas
│   │   ├── catalog.css     Barra de búsqueda, filtros, fichas y lista
│   │   ├── courses.css     Bandas de cursos
│   │   ├── footer.css      Contacto
│   │   └── dialogs.css     Ficha de recurso y popup «Sobre mí»
│   ├── js/
│   │   ├── main.js         Punto de entrada: carga datos y conecta eventos
│   │   ├── data.js         Lectura y validación de los JSON
│   │   ├── state.js        Estado de filtros y su reflejo en la URL
│   │   ├── search.js       Búsqueda sin tildes, orden y resaltado
│   │   ├── catalog.js      Filtros, fichas, lista y estado vacío
│   │   ├── home.js         Stickers, cifras, marquesina y bandas de cursos
│   │   ├── dialogs.js      Ficha de recurso, popup «Sobre mí» y avisos
│   │   ├── navbar.js       Comportamiento del menú fijo
│   │   ├── typer.js        Texto animado del buscador grande
│   │   ├── icons.js        Iconos SVG por tipo de recurso
│   │   └── utils.js        Utilidades compartidas
│   ├── fonts/              Archivo (variable), autoalojada + licencia OFL
│   └── img/                Foto de perfil y favicon
└── recursos/               Copias HTML de tus recursos (opcional, ver abajo)
```

---

## Agregar un recurso nuevo

Abre `data/recursos.json` y agrega un objeto al final de la lista (cuida la coma entre objetos):

```json
{
  "id": "mi-nuevo-juego",
  "titulo": "Mi nuevo juego",
  "curso": "interaccion-digital",
  "tipo": "juego",
  "semana": 12,
  "temas": ["ciudadanía digital", "gamificación"],
  "descripcion": "Una o dos frases sobre qué es y cómo se usa en clase.",
  "enlace": "recursos/mi-nuevo-juego/index.html",
  "fecha": "2026-11-25"
}
```

| Campo | Obligatorio | Qué es |
|---|---|---|
| `id` | Sí | Identificador único, en minúsculas y con guiones. Se usa en el enlace directo a la ficha (`?recurso=mi-nuevo-juego`). |
| `titulo` | Sí | Nombre visible del recurso. |
| `curso` | Sí | El `id` de un curso de `cursos.json`. |
| `tipo` | Sí | El `id` de un tipo de `tipos.json`. |
| `semana` | No | Número de semana del curso. Si no aplica, omite el campo. |
| `temas` | Sí | Lista de temas. Alimentan el buscador, el filtro de temas y la marquesina. Reutiliza los existentes cuando se pueda. |
| `descripcion` | Sí | Una o dos frases. |
| `enlace` | Sí | URL completa o ruta dentro del repositorio. |
| `fecha` | Sí | `AAAA-MM-DD`. Ordena «Más recientes» y muestra la etiqueta «Nuevo» durante 21 días. |

Guarda, haz commit y push. GitHub Pages lo publica en uno o dos minutos.

### Agregar un curso o una formación

En `data/cursos.json`, agrega un objeto con `id`, `nombre`, `corto` (nombre breve para pestañas y botones), `categoria`, `descripcion`, `color` y `colorTexto` (usa `#FFFFFF` si el color de fondo es oscuro y `#14123A` si es claro). El orden del archivo es el orden en la página.

### Agregar un tipo de recurso

En `data/tipos.json`, agrega `id`, `nombre`, `plural` e `icono`. Los iconos disponibles están en `assets/js/icons.js` (`presentacion`, `juego`, `quiz`, `guia`, `plantilla`, `ejemplo`, `video`, `enlace`); para uno nuevo, agrega su SVG allí.

---

## Alojar los recursos en el mismo repositorio

Para que cualquier visitante pueda abrir un recurso, su enlace debe ser público. La forma más estable es guardar cada recurso en `recursos/`, uno por carpeta:

```
recursos/
└── netiqueta-el-otro-lado-de-la-pantalla/
    └── index.html
```

y usar `"enlace": "recursos/netiqueta-el-otro-lado-de-la-pantalla/index.html"`.

> Varios enlaces actuales apuntan a artefactos privados de Claude (`claude.ai/artifact/...`). Mientras no los compartas públicamente o los copies a `recursos/`, los visitantes no podrán abrirlos.

---

## Ver el sitio en tu equipo

Los datos se cargan con `fetch`, y el navegador lo bloquea si abres `index.html` con doble clic (`file://`). Usa un servidor local:

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Terminal con Python:** dentro de la carpeta, `python -m http.server 8000` y abre <http://localhost:8000>.
- **Terminal con Node:** `npx serve .`

Si algo falla al editar un JSON (por ejemplo, una coma de más), la página muestra «No se pudo cargar el catálogo» y la consola del navegador indica el problema. Si un recurso apunta a un curso o tipo que no existe, se omite y aparece un aviso en la consola.

---

## Publicar en GitHub Pages

1. Sube todo el contenido de esta carpeta a la raíz del repositorio `education`.
2. En el repositorio: *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll.

---

## Enlaces útiles del sitio

| Enlace | Qué hace |
|---|---|
| `?curso=marca-personal-digital` | Abre el catálogo filtrado por curso |
| `?tipo=juego&orden=recientes` | Filtra por tipo y ordena por fecha |
| `?tema=storytelling&vista=lista` | Filtra por tema en vista de lista |
| `?q=seguridad` | Búsqueda de texto |
| `?recurso=hackea-al-estudiante` | Abre directamente la ficha de un recurso |
| `#sobre-mi` | Abre el popup de perfil |

Atajo de teclado: `/` lleva al buscador del catálogo.

---

## Personalizar

- **Colores de la interfaz:** variables en `assets/css/base.css` (`--ink`, `--paper`, `--cobalt`, `--orange`, `--lime`, `--orchid`).
- **Perfil, experiencia y formación:** texto en `index.html`, dentro de `<dialog id="about">`.
- **Foto:** reemplaza `assets/img/jhonnatan.webp` (PNG o WebP con fondo transparente, recorte vertical).
- **Palabras del buscador animado y días de «Nuevo»:** constantes al inicio de `assets/js/main.js`.

## Créditos

Diseño, contenido y recursos: Jhonnatan Eduardo Barrios Rodríguez. Fuente Archivo de Omnibus-Type, con licencia SIL Open Font License (ver `assets/fonts/LICENSE`).
