const Campground = require("../models/campground");

const getRecommendationsByDifficultyAndReview = async (currentCampsiteId) => {
  // Define difficulty values for comparison
  const difficultyValues = {
    Easy: 1,
    Moderate: 2,
    Challenging: 3,
  };

  // Find the current campsite and its difficulty level
  const currentCampsite = await Campground.findById(currentCampsiteId).populate(
    "reviews"
  );
  const { difficulty } = currentCampsite;

  // Fetch all campsites with the same difficulty, excluding the current campsite
  const similarDifficultyCampsites = await Campground.find({
    approved: true,
    _id: { $ne: currentCampsiteId },
  }).populate("reviews");

  // Define min and max for difficulty normalization
  const minDifficulty = 1; // Easy
  const maxDifficulty = 3; // Challenging

  // Add review count for each campsite and calculate the weighted score
  const campsitesWithScores = similarDifficultyCampsites.map((campsite) => {
    // Normalize difficulty using min-max normalization
    const difficultyScore =
      (difficultyValues[campsite.difficulty] - minDifficulty) /
      (maxDifficulty - minDifficulty);

    // Calculate the review count dynamically
    const reviewCount = campsite.reviews.length;

    // Normalize review count by scaling it based on max review count across all campsites
    const normalizedReviewCount =
      reviewCount /
      Math.max(...similarDifficultyCampsites.map((c) => c.reviews.length));

    // Calculate the weighted score for this campsite
    // Difficulty weight = 60%, Review count weight = 40%
    const score = 0.6 * difficultyScore + 0.4 * normalizedReviewCount;

    return { campsite, score };
  });

  // Sort by score (highest first) and limit results to top 5 recommendations
  const sortedCampsites = campsitesWithScores
    .sort((a, b) => b.score - a.score) // Sort by weighted score in descending order
    .slice(0, 5) // Limit to top 5 recommendations
    .map((item) => item.campsite); // Return only the campsite objects

  return sortedCampsites;
};

module.exports = getRecommendationsByDifficultyAndReview;
