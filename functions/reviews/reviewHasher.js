// /functions/reviews/reviewHasher.js
const crypto = require("crypto");

/**
 * Generates a unique ID based on the review content.
 * Accepts a normalized object from the sync loop.
 */
module.exports.hashReview = (review) => {
  // Use the mapped fields: author, time, and text
  const seed = `${review.author}|${review.time}|${review.text}`;
  
  return crypto
    .createHash("sha256")
    .update(seed)
    .digest("hex");
};