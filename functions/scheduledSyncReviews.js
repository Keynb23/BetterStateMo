const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const { fetchGoogleReviews } = require('./reviews/googleReviewsFetcher');
const { hashReview } = require('./reviews/reviewHasher');
const { filterReview } = require('./reviews/reviewFilterAgent');

const db = admin.firestore();

exports.syncGoogleReviews = onSchedule(
  {
    schedule: 'every 12 hours',
    secrets: ['OUTSCRAPER_API_KEY', 'GOOGLE_PLACE_ID'],
    region: 'us-central1',
    timeoutSeconds: 300, 
  },
  async () => { // Fixed: Removed (event) which was causing errors
    console.log('🚀 Starting Outscraper Sync Agent...');

    try {
      const metaRef = db.collection('sync_metadata').doc('google_reviews');
      const metaDoc = await metaRef.get();
      const lastSyncTime = metaDoc.exists ? (metaDoc.data().lastReviewTimestamp || 0) : 0;

      const reviews = await fetchGoogleReviews();
      
      let addedCount = 0;
      let latestTimestampFound = lastSyncTime;

      for (const review of reviews) {
        const reviewUnixTime = review.review_timestamp;
        const authorName = review.author_title || "A Valued Customer";
        const reviewText = review.review_text || "";
        const rating = review.review_rating;

        if (reviewUnixTime <= lastSyncTime) continue;

        // Use your specialized Filter Agent for the tiered logic
        const decision = filterReview({ text: reviewText, rating: rating });

        const id = hashReview({ author: authorName, time: reviewUnixTime, text: reviewText });
        const reviewRef = db.collection('reviews').doc(id);
        const existing = await reviewRef.get();
        
        if (existing.exists) continue;

        await reviewRef.set({
          author: authorName,
          rating: rating,
          text: reviewText,
          time: reviewUnixTime,
          visible: decision.allowed, // Tiered: true for 4+, false for 1-3
          filterReason: decision.reason || null,
          sentiment: decision.sentiment || null,
          source: 'outscraper_agent',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (reviewUnixTime > latestTimestampFound) {
          latestTimestampFound = reviewUnixTime;
        }
        addedCount++;
      }

      await metaRef.set({
        lastReviewTimestamp: latestTimestampFound,
        lastSyncExecution: admin.firestore.FieldValue.serverTimestamp(),
        reviewsAddedInLastRun: addedCount,
        status: 'success',
      }, { merge: true });

      console.log(`✅ Sync Complete. Added ${addedCount} reviews.`);

    } catch (error) {
      console.error('❌ Sync Failed:', error);
      await db.collection('sync_metadata').doc('google_reviews').set({
        status: 'failed',
        error: error.message,
        lastSyncExecution: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }
  }
);