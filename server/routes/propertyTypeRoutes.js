const express = require("express");
const router = express.Router();
const {
  createPropertyType,
  getAllPropertyTypes,
  getPropertyType,
  updatePropertyType,
  deletePropertyType,
} = require("../controllers/propertyTypeCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-type", createPropertyType);
router.get("/all-types", getAllPropertyTypes);
router.put("/edit-type/:id", authMiddleware, updatePropertyType);
router.delete("/delete-type/:id", deletePropertyType);
router.get("/:id", getPropertyType);

module.exports = router;
