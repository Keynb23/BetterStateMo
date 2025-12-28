// src/lib/dateUtils.js

/**
 * Converts Firestore/Unix timestamp to "Month Year"
 * @param {number} unixTimestamp - Time in seconds
 */
export const formatReviewDate = (unixTimestamp) => {
  if (!unixTimestamp) return "";

  // Multiply by 1000 because JS Date uses milliseconds
  const date = new Date(unixTimestamp * 1000);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};