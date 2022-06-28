import toxicity from "@tensorflow-models/toxicity";

class Toxicity {
  model;

  Toxicity() {
    this.model = null;
  }

  async classify(texts) {
    if (!this.model) this.model = await toxicity.load(0.7);
    const predictions = await this.model.classify(texts);

    const toxicLevel = Math.max(
      predictions[6].results[0].probabilities[1],
      predictions[6].results[1].probabilities[1]
    );

    return toxicLevel;
  }
}

export default new Toxicity();
