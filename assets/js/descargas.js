/**
 * Compatibilidad para recursos interactivos publicados en este sitio.
 * Algunos recursos piden un servicio de descargas (`downloads`) a su
 * entorno original. Aquí se ofrece una versión equivalente con el
 * navegador: crea el archivo y lo descarga con un enlace temporal.
 * Cualquier otro servicio se rechaza y el recurso usa su modo local.
 */
(function () {
  'use strict';
  if (window.claude && typeof window.claude.use === 'function') return;

  function toBlob(data, filename) {
    if (data instanceof Blob) return data;
    var type = /\.csv$/i.test(filename) ? 'text/csv;charset=utf-8'
      : /\.json$/i.test(filename) ? 'application/json'
      : /\.html?$/i.test(filename) ? 'text/html;charset=utf-8'
      : 'text/plain;charset=utf-8';
    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) return new Blob([data], { type: 'application/octet-stream' });
    return new Blob([typeof data === 'string' ? data : JSON.stringify(data)], { type: type });
  }

  var downloads = {
    save: function (opts) {
      return new Promise(function (resolve, reject) {
        try {
          var filename = (opts && opts.filename) || 'archivo';
          var url = URL.createObjectURL(toBlob(opts && opts.data, filename));
          var a = document.createElement('a');
          a.href = url; a.download = filename; a.rel = 'noopener'; a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
          resolve({ ok: true });
        } catch (e) { reject(e); }
      });
    }
  };

  window.claude = {
    use: function (name) {
      if (name === 'downloads') return Promise.resolve(downloads);
      var err = new Error('Servicio no disponible en este sitio: ' + name);
      err.code = 'unavailable';
      return Promise.reject(err);
    }
  };
})();
