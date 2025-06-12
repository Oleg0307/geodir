// docs/renderer.js

/**
 * Открывает попап у маркера с данными точки и вариантами ответа.
 */
export function abrirPopup(punto, marker, userCoords) {
  const { titulo, descripcion, pregunta } = punto;

  // Calcular distancia si hay coordenadas del usuario
  let dentroRadio = false;
  if (userCoords) {
    const distancia = calcularDistancia(userCoords, punto.coordenadas);
    dentroRadio = distancia <= 300;
  }

  let html = `
    <div class="popup-content">
      <h5>${titulo}</h5>
      <p>${descripcion}</p>
  `;

  if (dentroRadio && pregunta) {
    html += `
      <p><strong>${pregunta.enunciado}</strong></p>
      <div class="d-grid gap-2">
        ${pregunta.respuestas.map((opt, i) => `
          <button class="btn btn-outline-primary respuesta-btn" data-index="${i}">
            ${opt}
          </button>
        `).join('')}
      </div>
    `;
  } else if (!dentroRadio && pregunta) {
    html += `<p class="text-muted"><em>Punto fuera de alcance (más de 300m)</em></p>`;
  }

  html += `</div>`;

	marker.closePopup();       // Закрыть открытый попап (если есть)
	marker.unbindPopup();      // Удалить ранее привязанный pop-up
	marker.bindPopup(html).openPopup();  // Привязать и открыть заново


  // Agregar eventos solo si está dentro del rango
  if (dentroRadio && pregunta) {
    setTimeout(() => {
      document.querySelectorAll('.respuesta-btn').forEach(btn => {
        btn.onclick = () =>
          validarRespuesta(pregunta.correcta - 1, +btn.dataset.index, btn);
      });
    }, 0);
  }
}


/**
 * Подсвечивает правильный/неправильный ответ в попапе.
 */
export function validarRespuesta(idxCorrecto, idxElegido, btnEl) {
  if (idxElegido === idxCorrecto) {
    btnEl.classList.replace('btn-outline-primary','btn-success');
    btnEl.textContent += ' ✓';
  } else {
    btnEl.classList.replace('btn-outline-primary','btn-danger');
    btnEl.textContent += ' ✗';
    const correctoBtn = document.querySelector(`.respuesta-btn[data-index="${idxCorrecto}"]`);
    if (correctoBtn) {
      correctoBtn.classList.replace('btn-outline-primary','btn-success');
    }
  }
}

function calcularDistancia(coord1, coord2) {
  const R = 6371000; // Радиус Земли в метрах
  const rad = Math.PI / 180;
  const lat1 = coord1[0] * rad;
  const lat2 = coord2[0] * rad;
  const dLat = (coord2[0] - coord1[0]) * rad;
  const dLon = (coord2[1] - coord1[1]) * rad;

  const a = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
