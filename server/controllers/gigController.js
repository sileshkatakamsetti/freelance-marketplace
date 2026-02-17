const Gig = require("../models/Gig");

// CREATE GIG
exports.createGig = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const gig = await Gig.create({
      ...req.body,
      freelancer: req.user.id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL GIGS
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate("freelancer", "name role");
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE GIG
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: "Invalid Gig ID" });
  }
};

// UPDATE GIG
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE GIG
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await gig.deleteOne();
    res.json({ message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
