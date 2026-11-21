/**
 * Iconos de trazo por tipo de recurso.
 * La clave coincide con el campo "icono" de data/tipos.json.
 * Para un tipo nuevo: agrega aquí su SVG y usa esa clave en tipos.json.
 */
export const ICONS = {
  presentacion: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><rect x="4" y="6" width="24" height="16" rx="2"/><path d="M16 22v5M11 27h10"/><path d="M9 17l4-4 3 3 6-6"/></svg>',
  juego: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><rect x="5" y="5" width="22" height="22" rx="5" transform="rotate(8 16 16)"/><circle cx="11.5" cy="11.5" r="1.6" fill="currentColor"/><circle cx="20.5" cy="20.5" r="1.6" fill="currentColor"/><circle cx="16" cy="16" r="1.6" fill="currentColor"/></svg>',
  quiz: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M11 11.5a5 5 0 1 1 7.2 4.5c-1.4.7-2.2 1.6-2.2 3.2V20"/><circle cx="16" cy="25.5" r="1.4" fill="currentColor" stroke="none"/></svg>',
  guia: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7c4-1.5 7.5-1 11 1.5C19.5 6 23 5.5 27 7v18c-4-1.5-7.5-1-11 1.5C12.5 24 9 23.5 5 25z"/><path d="M16 8.5v18"/></svg>',
  plantilla: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="3.2 2.6"><rect x="4.5" y="4.5" width="23" height="23" rx="3"/><path d="M4.5 13h23M13 13v14.5" stroke-dasharray="0"/></svg>',
  ejemplo: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3.5" width="16" height="25" rx="2.5"/><path d="M12 9h8M12 13h5"/><path d="M12 24v-4M16 24v-6M20 24v-2.5"/></svg>',
  video: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><rect x="3.5" y="7" width="19" height="18" rx="3"/><path d="M22.5 13.5 28.5 10v12l-6-3.5z"/></svg>',
  enlace: '<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M13.5 18.5a5 5 0 0 0 7 0l4-4a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M18.5 13.5a5 5 0 0 0-7 0l-4 4a5 5 0 0 0 7 7l1.5-1.5"/></svg>'
};

export const icon = (key) => ICONS[key] || ICONS.enlace;
