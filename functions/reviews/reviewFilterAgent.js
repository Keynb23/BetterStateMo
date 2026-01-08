const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const BLOCKED_KEYWORDS = [
  "power wash", "power washed", "pressure washing",
  "windows", "deck", "driveway", "windows cleaning",
  "deck cleaning", "driveway cleaning", "driveway washed", "windows washed"
];

module.exports.filterReview = (review) => {
  const text = (review.text || "").toLowerCase();

  // 1. Block deprecated services
  if (BLOCKED_KEYWORDS.some(word => text.includes(word))) {
    return { allowed: false, reason: "deprecated_service" };
  }

  // 2. Tiered Visibility: Rating check
  if (review.rating < 4) {
    return { allowed: false, reason: "rating_too_low" };
  }

  // 3. Optional: Sentiment check for 4-5 star reviews that might be weird
  const sentimentResult = sentiment.analyze(review.text || "");
  const score = sentimentResult.comparative;

  if (score < -0.5) {
    return { allowed: false, reason: "negative_sentiment", sentiment: score };
  }

  return { allowed: true, sentiment: score };
};