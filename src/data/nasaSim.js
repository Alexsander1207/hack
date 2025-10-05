// src/data/nasaSim.js

export const nasaDataSim = [
  // Etapa 1: Inicio (Condiciones óptimas)
  {
    NDVI: "Ideal", // El vigor es bueno, no necesita fertilizar
    SMAP: "Ideal", // La humedad es perfecta, no necesita regar
    Clima: "Bajo", // Clima seco, bajo riesgo de rancha
  },
  // Etapa 2: Clima Seco (Alerta de riego SMAP)
  {
    NDVI: "Ideal",
    SMAP: "Seco", // ¡Alerta! Necesita riego
    Clima: "Bajo",
  },
  // Etapa 3: Bajada de Vigor (Alerta de nutrición NDVI)
  {
    NDVI: "Bajo", // ¡Alerta! Necesita fertilización
    SMAP: "Ideal",
    Clima: "Bajo",
  },
  // Etapa 4: Lluvias (Alerta de Rancha - Clima)
  {
    NDVI: "Ideal",
    SMAP: "Saturado", // Hay mucha agua por lluvia (riesgo de asfixia radical)
    Clima: "ALTO", // ¡Clima cálido/húmedo! ALTO riesgo de tizón
  },
  // Etapa 5: Recuperación
  {
    NDVI: "Ideal",
    SMAP: "Ideal",
    Clima: "Bajo",
  },
  // Etapa 6: Exceso de Nutrientes (Mala decisión previa)
  {
    NDVI: "Muy Alto", // Exceso de vigor (sobre-fertilización previa) = insostenible
    SMAP: "Ideal",
    Clima: "Bajo",
  },
  // Etapa 7: Sequía severa
  {
    NDVI: "Bajo",
    SMAP: "MUY SECO", // Riesgo de pérdida de cosecha
    Clima: "Bajo",
  },
  // Etapa 8: Clima perfecto para la rancha
  {
    NDVI: "Ideal",
    SMAP: "Ideal",
    Clima: "ALTO", // ¡Nuevo ALTO riesgo!
  },
  // Etapa 9: Final de ciclo (Poca necesidad)
  {
    NDVI: "Bajo", // Cerca del final, vigor cae
    SMAP: "Ideal",
    Clima: "Bajo",
  },
  // Etapa 10: Última oportunidad
  {
    NDVI: "Ideal",
    SMAP: "Seco",
    Clima: "Moderado",
  },
];