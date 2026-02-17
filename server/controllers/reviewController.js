const Review = require("../models/Review");
const Gig = require("../models/Gig");

/*
=================================================
POST REVIEW
=================================================
*/
exports.createReview = async (req, res) => {
  try {
    const { gig, order, rating, comment } = req.body;

    // 1️⃣ Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // 2️⃣ Prevent duplicate review per order
    const alreadyReviewed = await Review.findOne({ order });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "Review already submitted for this order",
      });
    }

    // 3️⃣ Create review
    const review = await Review.create({
      gig,
      order,
      user: req.user._id,
      rating,
      comment,
    });

    /*
    =========================================
    🔥 Recalculate Gig Rating
    =========================================
    */
    const reviews = await Review.find({ gig });

    const totalRating = reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    await Gig.findByIdAndUpdate(gig, {
      averageRating: Number(averageRating.toFixed(1)),
      numReviews: reviews.length,
    });

    res.status(201).json(review);

  } catch (error) {
    console.error("Create review error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/*
=================================================
GET REVIEWS BY GIG ID
=================================================
*/
exports.getReviewsByGig = async (req, res) => {
  try {
    const reviews = await Review.find({ gig: req.params.gigId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);

  } catch (error) {
    console.error("Get reviews error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
