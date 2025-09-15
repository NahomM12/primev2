const express = require("express");
const router = express.Router();
const {
  getAllCleanupStatus,
  updateConfiguration,
  runManualCleanup,
  getStatistics,
} = require("../controllers/systemCleanupCtrl");
const { adminMiddleware } = require("../middlewares/authMiddleware"); // Assuming you have an isAdmin middleware

// All routes in this file are protected and for admins only
router.use(adminMiddleware);
// router.use(isAdmin); // Uncomment this line when you have your isAdmin middleware ready
router.get("/search-history/status", getAllCleanupStatus);
router.get("/search-history/stats", getStatistics);
router.put("/search-history/config/:type", updateConfiguration);
router.post("/search-history/run/:type", runManualCleanup);

module.exports = router;
