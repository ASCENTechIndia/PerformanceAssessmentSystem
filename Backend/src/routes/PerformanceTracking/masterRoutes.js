const express = require("express");
const { validate } = require("../../validators/validate");
const {
  AOPT_TASKTYPE_INSUPD,
  getTaskTypeList,
  getTaskTypeDropdown,
} = require("../../controllers/PerformanceTracking/masterController");
const {
  aoptTaskTypeInsUpdSchema,
} = require("../../validators/schemas/masterSchema");

const router = express.Router();

// Task Type master
router.post(
  "/AOPT_TASKTYPE_INSUPD",
  validate(aoptTaskTypeInsUpdSchema),
  AOPT_TASKTYPE_INSUPD,
);
router.get("/getTaskTypeList", getTaskTypeList);

// Create Task
router.get("/getTaskTypeDropdown", getTaskTypeDropdown);

module.exports = router;
