// /functions/reviews/googleReviewsFetcher.js
const axios = require('axios');

module.exports.fetchGoogleReviews = async () => {
  const apiKey = process.env.OUTSCRAPER_API_KEY;
  //   const placeId = process.env.GOOGLE_PLACE_ID;

  // Using the reviews-v3 endpoint for maximum reliability
  const query = encodeURIComponent('Better State Pool Service Missouri');
  const url = `https://api.app.outscraper.com/maps/reviews-v3?query=${query}&reviewsLimit=20&async=false`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    // Outscraper returns an array of places, each containing a reviews_data array
    const placeData = response.data.data?.[0];
    const reviews = placeData?.reviews_data || [];

    console.log(
      `DEBUG: Outscraper found ${reviews.length} reviews for ${placeData?.name || 'Unknown'}`,
    );

    return reviews;
  } catch (err) {
    console.error('DEBUG: Outscraper Fetch Failed:', err.response?.data || err.message);
    return [];
  }
};
