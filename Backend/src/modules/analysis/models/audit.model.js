class Audit {
  constructor({ projectId, language }) {
    this.projectId = projectId;
    this.language = language;
    this.dimensions = [];
    this.overallScore = 0;
  }

  addDimension(dimension) {
    this.dimensions.push(dimension);
  }

  calculateOverallScore() {
    if (this.dimensions.length === 0) {
      this.overallScore = 0;
      return;
    }

    const total = this.dimensions.reduce(
      (sum, d) => sum + d.score,
      0
    );

    this.overallScore = total / this.dimensions.length;
  }

  toJSON() {
    return {
      projectId: this.projectId,
      language: this.language,
      overallScore: this.overallScore,
      dimensions: this.dimensions.map(d => d.toJSON())
    };
  }
}

export default Audit;