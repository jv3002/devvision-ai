import fs from "fs";
import path from "path";

import Audit from "./models/audit.model.js";
import AuditDimension from "./models/dimension.model.js";
import MetricResult from "./models/metric.model.js";
import jsAdapter from "./adapters/javascript.adapter.js";

class AnalysisEngine {
  async analyzeProject({ projectId, projectPath, language = "javascript" }) {
    const audit = new Audit({ projectId, language });

    const files = this.scanFiles(projectPath);

    const parsedFiles = files.map(file => ({
      file,
      data: jsAdapter.parseFile(file)
    }));

    /* =============================
       MÉTRICAS POR ARCHIVO
    ============================== */

    const fileMetrics = parsedFiles.map(f => {
      const lines = f.data.lines;
      const functions = f.data.functions.length;
      const imports = f.data.imports.length;

      const complexity = functions / (lines || 1);

      return {
        file: f.file,
        lines,
        functions,
        imports,
        complexity
      };
    });

    /* =============================
       🔥 NUEVO: HOTSPOTS
    ============================== */

    const hotspots = fileMetrics
      .filter(f => f.lines > 300 || f.complexity > 0.05)
      .sort((a, b) => (b.lines + b.functions) - (a.lines + a.functions))
      .slice(0, 5);

    /* =============================
       DIMENSIÓN 1: CALIDAD ESTRUCTURAL
    ============================== */

    const structural = new AuditDimension({
      key: "structural_quality",
      name: "Calidad Estructural",
      weight: 1
    });

    const totalLines = parsedFiles.reduce(
      (sum, f) => sum + f.data.lines,
      0
    );

    const avgFunctionSize = this.calculateAverageFunctionSize(parsedFiles);

    structural.addMetric(
      new MetricResult({
        key: "total_files",
        name: "Cantidad de archivos",
        description: "Número total de archivos analizados",
        value: files.length,
        normalized: this.normalizeTotalFiles(files.length),
        weight: 0.3
      })
    );

    structural.addMetric(
      new MetricResult({
        key: "total_lines",
        name: "Cantidad total de líneas",
        description: "Cantidad total de líneas",
        value: totalLines,
        normalized: this.normalizeTotalLines(totalLines),
        weight: 0.3
      })
    );

    structural.addMetric(
      new MetricResult({
        key: "avg_function_size",
        name: "Tamaño promedio de funciones",
        description: "Promedio de líneas por función",
        value: avgFunctionSize,
        normalized: this.normalizeFunctionSize(avgFunctionSize),
        weight: 0.4
      })
    );

    structural.calculateScore();
    audit.addDimension(structural);

    /* =============================
       DIMENSIÓN 2: ARQUITECTURA
    ============================== */

    const architecture = new AuditDimension({
      key: "architecture",
      name: "Arquitectura",
      weight: 1
    });

    const totalImports = parsedFiles.reduce(
      (sum, f) => sum + f.data.imports.length,
      0
    );

    const avgCoupling =
      files.length === 0 ? 0 : totalImports / files.length;

    architecture.addMetric(
      new MetricResult({
        key: "avg_coupling",
        name: "Acoplamiento promedio",
        description: "Dependencias por archivo",
        value: avgCoupling,
        normalized: this.normalizeCoupling(avgCoupling),
        weight: 0.6
      })
    );

    architecture.addMetric(
      new MetricResult({
        key: "import_density",
        name: "Densidad de imports",
        description: "Cantidad total de imports",
        value: totalImports,
        normalized: this.normalizeImportDensity(totalImports),
        weight: 0.4
      })
    );

    architecture.calculateScore();
    audit.addDimension(architecture);

    /* =============================
       SCORE FINAL
    ============================== */

    audit.calculateOverallScore();

    const result = audit.toJSON();

    // 🔥 AGREGAMOS HOTSPOTS AL RESULTADO
    result.hotspots = hotspots;

    return result;
  }

  /* =============================
     NORMALIZADORES
  ============================== */

  normalizeTotalFiles(files) {
    if (files < 5) return 0.6;
    if (files < 20) return 0.8;
    if (files < 100) return 1;
    return 0.9;
  }

  normalizeTotalLines(lines) {
    if (lines < 200) return 0.7;
    if (lines < 2000) return 1;
    if (lines < 10000) return 0.9;
    return 0.7;
  }

  normalizeFunctionSize(avg) {
    if (avg <= 20) return 1;
    if (avg <= 50) return 0.8;
    if (avg <= 100) return 0.5;
    return 0.2;
  }

  normalizeCoupling(avg) {
    if (avg <= 3) return 1;
    if (avg <= 7) return 0.7;
    if (avg <= 15) return 0.4;
    return 0.2;
  }

  normalizeImportDensity(total) {
    if (total <= 20) return 1;
    if (total <= 50) return 0.8;
    if (total <= 100) return 0.5;
    return 0.3;
  }

  /* =============================
     UTILIDADES
  ============================== */

  scanFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(this.scanFiles(filePath));
      } else if (file.endsWith(".js")) {
        results.push(filePath);
      }
    });

    return results;
  }

  calculateAverageFunctionSize(parsedFiles) {
    let total = 0;
    let count = 0;

    parsedFiles.forEach(f => {
      f.data.functions.forEach(size => {
        total += size;
        count++;
      });
    });

    return count === 0 ? 0 : total / count;
  }
}

export default new AnalysisEngine();