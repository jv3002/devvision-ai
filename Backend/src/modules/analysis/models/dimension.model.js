class AuditDimension {
  constructor({ key, name, weight }) {
    this.key = key;
    this.name = name;
    this.weight = weight;
    this.metrics = [];
    this.score = 0;
  }

  addMetric(metric) {
    this.metrics.push(metric);
  }

  calculateScore() {
    this.metrics.forEach(m => m.calculateScore());

    const total = this.metrics.reduce(
      (sum, m) => sum + m.score,
      0
    );

    this.score = total;
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      score: this.score,
      metrics: this.metrics.map(m => m.toJSON())
    };
  }
}

export default AuditDimension;