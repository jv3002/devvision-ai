class MetricResult {
  constructor({ key, name, description, value, normalized, weight }) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.value = value;
    this.normalized = normalized; // 0–1
    this.weight = weight;
    this.score = 0;
  }

  calculateScore() {
    this.score = this.normalized * this.weight * 100;
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      description: this.description,
      value: this.value,
      score: this.score
    };
  }
}

export default MetricResult;