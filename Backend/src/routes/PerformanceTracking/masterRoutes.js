const express = require("express");
const { validate } = require("../../validators/validate");
const {
  AOPT_TASKTYPE_INSUPD,
} = require("../../controllers/PerformanceTracking/masterController");
const {
  aoptTaskTypeInsUpdSchema,
} = require("../../validators/schemas/masterSchema");

const router = express.Router();

router.post(
  "/AOPT_TASKTYPE_INSUPD",
  validate(aoptTaskTypeInsUpdSchema),
  AOPT_TASKTYPE_INSUPD,
);

module.exports = router;
