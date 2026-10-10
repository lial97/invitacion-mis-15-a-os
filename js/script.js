/* ==========================================================
   CONFIGURACIÓN — edita estos valores
   ========================================================== */
const CONFIG = {
  // Fecha y hora de la fiesta en hora de Colombia (-05:00), así el conteo
  // es correcto aunque el invitado esté en otro país.
  fechaFiesta: new Date('2026-12-12T20:00:00-05:00'),
  duracionHoras: 6,

  // Datos del evento para "Agregar al calendario"
  tituloEvento: 'XV años de Yandeilys 🎉',
  ubicacion: 'https://maps.app.goo.gl/i4c8Ji9uLC6Z8i9s9',

  // Número de WhatsApp para confirmar (código de país + número, sin + ni espacios)
  whatsapp: '573046056509',
  mensajeWhatsapp: '¡Hola! Confirmo mi asistencia a los XV años de Yandeilys 🎉',

  // Volumen de la música (0 a 1)
  volumen: 0.6,
};

/* ===================== Conteo regresivo ===================== */
const el = {
  dias: document.getElementById('dias'),
  horas: document.getElementById('horas'),
  minutos: document.getElementById('minutos'),
  segundos: document.getElementById('segundos'),
  contador: document.getElementById('contador'),
  final: document.getElementById('mensaje-final'),
};

const dosDigitos = (n) => String(n).padStart(2, '0');

function actualizarConteo() {
  const diff = CONFIG.fechaFiesta - new Date();

  if (diff <= 0) {
    el.contador.hidden = true;
    el.final.hidden = false;
    clearInterval(intervaloConteo);
    return;
  }

  const seg = Math.floor(diff / 1000);
  el.dias.textContent = dosDigitos(Math.floor(seg / 86400));
  el.horas.textContent = dosDigitos(Math.floor((seg % 86400) / 3600));
  el.minutos.textContent = dosDigitos(Math.floor((seg % 3600) / 60));
  el.segundos.textContent = dosDigitos(seg % 60);
}

const intervaloConteo = setInterval(actualizarConteo, 1000);
actualizarConteo();

/* ===================== Música ===================== */
const cancion = document.getElementById('cancion');
const btnMusica = document.getElementById('btn-musica');
cancion.volume = CONFIG.volumen;

function reproducir() {
  cancion.play()
    .then(() => {
      btnMusica.classList.remove('pausado');
      btnMusica.classList.add('sonando');
    })
    .catch(() => btnMusica.classList.add('pausado'));
}

btnMusica.addEventListener('click', () => {
  if (cancion.paused) {
    reproducir();
  } else {
    cancion.pause();
    btnMusica.classList.replace('sonando', 'pausado');
  }
});

// Intenta sonar apenas se abre la página. Si el navegador lo bloquea
// (casi todos lo hacen hasta que el visitante toca la pantalla),
// la canción empieza con el primer toque o clic en cualquier parte.
reproducir();

function primerToque(e) {
  document.removeEventListener('pointerdown', primerToque);
  if (cancion.paused && !btnMusica.contains(e.target)) reproducir();
}
document.addEventListener('pointerdown', primerToque);

/* ===================== Pantalla de bienvenida ===================== */
const intro = document.getElementById('intro');
document.body.classList.add('bloqueado');

document.getElementById('btn-abrir').addEventListener('click', () => {
  reproducir();
  intro.classList.add('oculto');
  document.body.classList.remove('bloqueado');
  iniciarParticulas();
});

/* ===================== Partículas (pétalos y brillos) ===================== */
const contenedorParticulas = document.querySelector('.particulas');
const simbolos = ['🌿', '🍃', '✨', '🦋', '✦'];
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function crearParticula() {
  const p = document.createElement('span');
  p.className = 'particula';
  p.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.fontSize = 12 + Math.random() * 16 + 'px';
  p.style.animationDuration = 7 + Math.random() * 8 + 's';
  contenedorParticulas.appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}

function iniciarParticulas() {
  if (reducirMovimiento) return;
  setInterval(crearParticula, 700);
}

/* ===================== Aparición al hacer scroll ===================== */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observador.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.revelar').forEach((s) => observador.observe(s));

/* ===================== Fotos de ejemplo =====================
   Si todavía no has subido una foto, se muestra un marcador verde.
   Para usar tus fotos colócalas en la carpeta img/ con estos nombres:
   principal.jpg, foto1.jpg ... foto6.jpg */
function marcador(texto) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e8f5ec"/><stop offset="1" stop-color="#b5dcc2"/>
      </linearGradient></defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <text x="300" y="380" font-size="90" text-anchor="middle">📷</text>
      <text x="300" y="470" font-family="Georgia, serif" font-size="40" fill="#5e9474" text-anchor="middle">${texto}</text>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

document.querySelectorAll('img[data-placeholder]').forEach((img) => {
  const poner = () => { img.src = marcador(img.dataset.placeholder); };
  if (img.complete && img.naturalWidth === 0) poner();
  else img.addEventListener('error', poner, { once: true });
});

/* ===================== Visor de fotos ===================== */
document.querySelectorAll('.grid-fotos img').forEach((img) => {
  img.addEventListener('click', () => {
    const visor = document.createElement('div');
    visor.className = 'visor';
    visor.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    visor.addEventListener('click', () => visor.remove());
    document.body.appendChild(visor);
  });
});

/* ===================== WhatsApp ===================== */
document.getElementById('btn-whatsapp').href =
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensajeWhatsapp)}`;

/* ===================== Agregar al calendario =====================
   Al confirmar por WhatsApp se ofrece guardar el evento en el calendario
   del invitado. Su app de calendario se encarga de los recordatorios. */
const fin = new Date(CONFIG.fechaFiesta.getTime() + CONFIG.duracionHoras * 3600 * 1000);
const formatoUTC = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const descripcion = `¡Te espero para celebrar mis XV años!\nUbicación: ${CONFIG.ubicacion}`;

document.getElementById('cal-google').href =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent(CONFIG.tituloEvento)}` +
  `&dates=${formatoUTC(CONFIG.fechaFiesta)}/${formatoUTC(fin)}` +
  `&details=${encodeURIComponent(descripcion)}` +
  `&location=${encodeURIComponent(CONFIG.ubicacion)}`;

// Archivo .ics para iPhone, Outlook y otros calendarios, con avisos
// un día antes y tres horas antes.
const ics = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitacion XV//ES', 'BEGIN:VEVENT',
  `UID:xv-yandeilys-${formatoUTC(CONFIG.fechaFiesta)}@invitacion`,
  `DTSTAMP:${formatoUTC(new Date())}`,
  `DTSTART:${formatoUTC(CONFIG.fechaFiesta)}`,
  `DTEND:${formatoUTC(fin)}`,
  `SUMMARY:${CONFIG.tituloEvento}`,
  `DESCRIPTION:${descripcion.replace(/\n/g, '\\n')}`,
  `LOCATION:${CONFIG.ubicacion}`,
  'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Mañana son los XV de Yandeilys', 'END:VALARM',
  'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', 'DESCRIPTION:Hoy son los XV de Yandeilys', 'END:VALARM',
  'END:VEVENT', 'END:VCALENDAR',
].join('\r\n');
document.getElementById('cal-ics').href =
  'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);

const modalCal = document.getElementById('modal-calendario');
const cerrarModal = () => { modalCal.hidden = true; };

document.getElementById('btn-whatsapp').addEventListener('click', () => {
  // WhatsApp se abre en otra pestaña o app; al volver, la pregunta ya está aquí.
  setTimeout(() => { modalCal.hidden = false; }, 400);
});
modalCal.querySelectorAll('a, .cerrar').forEach((b) => b.addEventListener('click', () => setTimeout(cerrarModal, 100)));
modalCal.addEventListener('click', (e) => { if (e.target === modalCal) cerrarModal(); });
