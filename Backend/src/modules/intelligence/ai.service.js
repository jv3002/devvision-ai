export const generateAISuggestion = async (data) => {

  console.log("🧠 generateAISuggestion (modo LOCAL)");

  return {
    score: 7,
    suggestions: [
      "Refactorizar funciones largas",
      "Agregar validaciones de entrada",
      "Separar lógica en capas"
    ],
    risks: [
      "Código poco escalable",
      "Posibles errores no controlados"
    ]
  };

};