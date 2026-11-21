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
│   │   ├── utils.js        Utilidades compartidas
│   │   └── descargas.js    Descargas de archivos dentro de los recursos interactivos
│   ├── deck/               Reproductor de presentaciones y plantillas (CSS, JS, iconos)
│   ├── libs/               Librerías de terceros (jsPDF)
│   ├── fonts/              Archivo (variable), autoalojada + licencia OFL
│   └── img/                Foto de perfil y favicon
└── recursos/               Los 45 recursos, una carpeta por recurso (ver abajo)
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
  "enlace": "recursos/mi-nuevo-juego/",
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
| `enlace` | Sí | Carpeta del recurso dentro de `recursos/` (o una URL externa pública). |
| `fecha` | Sí | `AAAA-MM-DD`. Ordena «Más recientes» y muestra la etiqueta «Nuevo» durante 21 días. |

Guarda, haz commit y push. GitHub Pages lo publica en uno o dos minutos.

### Agregar un curso o una formación

En `data/cursos.json`, agrega un objeto con `id`, `nombre`, `corto` (nombre breve para pestañas y botones), `categoria`, `descripcion`, `color` y `colorTexto` (usa `#FFFFFF` si el color de fondo es oscuro y `#14123A` si es claro). El orden del archivo es el orden en la página.

### Agregar un tipo de recurso

En `data/tipos.json`, agrega `id`, `nombre`, `plural` e `icono`. Los iconos disponibles están en `assets/js/icons.js` (`presentacion`, `juego`, `quiz`, `plantilla`, `ejemplo`, `video`, `enlace`); para uno nuevo, agrega su SVG allí.

---

## Recursos alojados en el sitio

Todos los recursos viven dentro del proyecto, en `recursos/`, uno por carpeta. Al abrirlos desde una ficha se cargan en una pestaña nueva del mismo sitio, sin depender de otra plataforma.

```
recursos/
├── hackea-al-estudiante/
│   └── index.html              ← juego o recurso interactivo
└── produccion-audiovisual/
    ├── index.html              ← presentación
    └── img/                    ← imágenes de esa presentación
```

En `data/recursos.json`, el enlace es la carpeta: `"enlace": "recursos/hackea-al-estudiante/"`.

### Presentaciones

Las presentaciones usan un reproductor común (`assets/deck/`). Cada diapositiva es un `<section>` de 1920 × 1080 px dentro de `.stage`:

```html
<body data-deck="mi-presentacion" data-course="Interacción Digital">
<main class="stage-wrap"><div class="stage">
  <section style="background:#fff;padding:128px">…</section>
  <section>…</section>
</div></main>
<script src="../../assets/deck/deck.js"></script>
</body>
```

con `<link rel="stylesheet" href="../../assets/deck/deck.css">` en el `<head>`. El reproductor agrega la barra de control, la vista general (tecla G), pantalla completa (F), navegación con flechas o deslizando el dedo, enlace directo a una diapositiva (`#5`) e impresión o PDF con una diapositiva por página.

### Plantillas y fichas para llenar

Si el `<body>` lleva el atributo `data-fillable`, cada texto entre corchetes (`[Escribe tu frase]`, `[ ]`) se convierte en un espacio para escribir. El estudiante pulsa **Llenar**, completa los espacios, y lo que escribe se guarda en su navegador; con **PDF** lo descarga para entregarlo y con **Borrar** empieza de nuevo.

### Recursos interactivos

Los juegos, quizzes e infografías son páginas HTML completas. Si un recurso descarga archivos, incluye antes de sus scripts `<script src="../../assets/js/descargas.js"></script>`, que hace la descarga desde el navegador. Las librerías externas van en `assets/libs/` (por ejemplo, `assets/libs/jspdf/`).

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
