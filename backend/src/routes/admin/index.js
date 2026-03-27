const express = require("express");

const itemsRoutes = require("./items");
const uploadsRoutes = require("./uploads");
const historyRoutes = require("./history");
const featuredSermonRoutes = require("./featuredSermon");

const router = express.Router();

router.use(itemsRoutes);
router.use(uploadsRoutes);
router.use(historyRoutes);
router.use(featuredSermonRoutes);

module.exports = router;

