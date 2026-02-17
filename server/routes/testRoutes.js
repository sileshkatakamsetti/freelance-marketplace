const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have access",
    user: req.user,
  });
});

module.exports = router;
