export const generateRefactorSuggestions = (hotspots = []) => {

  return hotspots.map(h => {

    const suggestions = [];

    if (h.lines > 400) {
      suggestions.push("Split this file into smaller modules (controller/service)");
    }

    if (h.functions > 15) {
      suggestions.push("Reduce number of functions by grouping related logic");
    }

    if (h.complexity > 0.05) {
      suggestions.push("Simplify logic and reduce nested functions");
    }

    if (h.imports > 10) {
      suggestions.push("Reduce dependencies and decouple modules");
    }

    if (suggestions.length === 0) {
      suggestions.push("File is acceptable but can be optimized");
    }

    return {
      file: h.file,
      suggestions
    };

  });

};