export const CODE_REVIEW_PROMPT = (code) => `
Analiza este código como un ingeniero senior:

${code}

Responde en JSON con:
- qualityScore
- issues
- improvements
- risks
`;

export const DEV_ANALYSIS_PROMPT = (commits) => `
Analiza el rendimiento de este desarrollador basado en sus commits:

${commits}

Entrega:
- nivel de experiencia
- calidad del código
- riesgos
- recomendaciones
`;