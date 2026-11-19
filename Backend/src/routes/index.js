const express = require("express");
const router = express.Router();

const authRoutes = require("./Admin/authRoutes");
router.use("/", authRoutes);

const logoroutes = require("./Admin/logoroutes");
router.use("/", logoroutes);

const logoutRoutes = require("./Admin/logoutRoutes.js");
router.use("/", logoutRoutes);

const menurouted = require("./Admin/menuRoutes.js");
router.use("/", menurouted);

// Performance assessment system all pages routes
const masterRoute = require("./PerformanceTracking/masterRoutes.js");
router.use("/", masterRoute);

const taskManagementRoute = require("./PerformanceTracking/taskManagementRoutes.js");
router.use("/", taskManagementRoute);

module.exports = router;
