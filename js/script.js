/* ==========================================================
   CONFIGURACIÓN — edita estos valores
   ========================================================== */
const CONFIG = {
  // Fecha y hora de la fiesta (año, mes 0-11, día, hora, minuto).
  // Diciembre = 11.
  fechaFiesta: new Date(2026, 11, 12, 20, 0, 0),

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
