// src/data/nasaSim.js

export const nasaDataSim = [
  // Etapa 1: Condiciones Ideales
  { NDVI: "Ideal", SMAP: "Ideal", Clima: "Bajo" }, 
  // Etapa 2: Alerta de Sequía (SMAP)
  { NDVI: "Ideal", SMAP: "Seco", Clima: "Bajo" }, 
  // Etapa 3: Alerta de Nutrición (NDVI)
  { NDVI: "Bajo", SMAP: "Ideal", Clima: "Bajo" }, 
  // Etapa 4: Alerta de Rancha por Lluvia (Clima)
  { NDVI: "Ideal", SMAP: "Saturado", Clima: "ALTO" },
  // Etapa 5: Vigor Alto (Riesgo de sobre-fertilización previa)
  { NDVI: "Muy Alto", SMAP: "Ideal", Clima: "Moderado" },
  // Etapa 6: Sequía Extrema (SMAP)
  { NDVI: "Bajo", SMAP: "MUY SECO", Clima: "Bajo" },
  // Etapa 7: Alto Riesgo de Rancha y Vigor Bajo
  { NDVI: "Bajo", SMAP: "Ideal", Clima: "ALTO" },
  // Etapa 8: Recuperación de la tierra
  { NDVI: "Ideal", SMAP: "Ideal", Clima: "Bajo" },
  // Etapa 9: Fin de ciclo
  { NDVI: "Bajo", SMAP: "Seco", Clima: "Moderado" },
  // Etapa 10: Último riego (SMAP)
  { NDVI: "Ideal", SMAP: "Seco", Clima: "Bajo" },
];