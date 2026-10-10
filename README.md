# Invitación Mis XV Años

Página web de invitación para una fiesta de 15 años: pantalla de bienvenida,
música de fondo, conteo regresivo al **12 de diciembre de 2026**, galería de
fotos, lugares del evento, código de vestimenta y confirmación por WhatsApp.

## Cómo personalizarla

| Qué | Dónde |
| --- | --- |
| Canción | Copia tu pista como `audio/cancion.mp3` |
| Foto principal (redonda) | `img/principal.jpg` |
| Galería (6 fotos) | `img/foto1.jpg` … `img/foto6.jpg` |
| Nombre, padres, padrinos, lugares, horas | `index.html` |
| Fecha/hora de la fiesta, WhatsApp, volumen | Objeto `CONFIG` al inicio de `js/script.js` |
| Colores | Variables `:root` al inicio de `css/styles.css` |

Mientras no subas las fotos, se muestran marcadores verdes con un 📷.

> La música empieza al pulsar **"Abrir invitación"**: los navegadores no
> permiten reproducir audio automáticamente sin que el visitante toque la página.

## Verla en tu computadora

Abre `index.html` en el navegador, o ejecuta `python3 -m http.server` en esta
carpeta y entra a http://localhost:8000.

## Publicarla gratis

En GitHub: **Settings → Pages → Branch: main / (root) → Save**. La invitación
quedará en `https://<tu-usuario>.github.io/invitacion-mis-15-a-os/`.
