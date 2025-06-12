// docs/renderer.js

/**
 * Открывает попап у маркера с данными точки и вариантами ответа.
 */
export function abrirPopup(punto, marker) {
  const { titulo, descripcion, pregunta } = punto;
  const html = `
    <div class="popup-content">
      <h5>${titulo}</h5>
      <p>${descripcion}</p>
      <p><strong>${pregunta.enunciado}</strong></p>
      <div class="d-grid gap-2">
        ${pregunta.respuestas.map((opt,i) => `
          <button class="btn btn-outline-primary respuesta-btn" data-index="${i}">
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  marker.bindPopup(html).openPopup();
  setTimeout(() => {
    document.querySelectorAll('.respuesta-btn').forEach(btn => {
      btn.onclick = () => validarRespuesta(pregunta.correcta - 1, +btn.dataset.index, btn);
    });
  }, 0);
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
