//  Importar función abrirPopup desde renderer.js
import { abrirPopup } from './renderer.js';

//  Crear el mapa Leaflet centrado en Jávea
const map = L.map('map').setView([38.7895, 0.1669], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//  Función para cargar marcadores desde un JSON
function cargarMapa(data) {
  // Eliminar marcadores previos si existen
  if (window.markers) {
    window.markers.forEach(m => map.removeLayer(m));
  }
  window.markers = [];

  data.forEach(punto => {
    const marker = L.marker(punto.coordenadas).addTo(map);
    marker.on('click', () => abrirPopup(punto, marker));
    window.markers.push(marker);
  });

  if (data.length > 0) {
    map.setView(data[0].coordenadas, 15); // Centrar en el primer punto
  }
}

//  Escuchador para seleccionar el pueblo desde el desplegable
document.getElementById('pueblo-select').addEventListener('change', async (e) => {
  const pueblo = e.target.value;

  if (!pueblo) return;

  try {
    // Construir URL del archivo JSON en GitHub
    const manifestUrl = `https://raw.githubusercontent.com/Oleg0307/geodir/main/geodata/${pueblo}/${pueblo}.json`;

    // Obtener el archivo JSON
    const response = await fetch(manifestUrl);

    if (!response.ok) throw new Error('No se pudo obtener el archivo JSON');

    const data = await response.json();

    // Mostrar puntos en el mapa
    cargarMapa(data);

  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo cargar el pueblo seleccionado.");
  }
});


// Mostrar la ubicación del usuario si está disponible
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    const userMarker = L.marker([latitude, longitude], {
      title: "Tu ubicación",
      icon: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })
    }).addTo(map);

    userMarker.bindPopup("Estás aquí").openPopup();
    // Opcional: centrar mapa en el usuario
    // map.setView([latitude, longitude], 14);
  }, (error) => {
    console.warn("No se pudo obtener ubicación del usuario:", error.message);
  });
} else {
  console.warn("Geolocalización no disponible en este navegador.");
}
