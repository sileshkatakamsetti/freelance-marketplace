const express = require("express");
const router = express.Router();

const {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
} = require("../controllers/gigController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE gig (Freelancer only)
router.post("/", authMiddleware, createGig);

// GET all gigs (Public)
router.get("/", getAllGigs);

// GET single gig (Public)
router.get("/:id", getGigById);

// UPDATE gig (Freelancer only – own gig)
router.put("/:id", authMiddleware, updateGig);

// DELETE gig (Freelancer only – own gig)
router.delete("/:id", authMiddleware, deleteGig);

module.exports = router;
