const express = require("express");
const {
  getTaskTypeDropdown,
  getParentTaskDropdown,
  AOPT_TASK_INSUPD,
  AOPT_TASKSTATUS_INSUPD,
  getUlbDropdown,
  getTaskList,
} = require("../../controllers/PerformanceTracking/taskManagementController");
const {
  aoptTaskInsUpdSchema,
  aoptTaskStatusInsUpdSchema,
} = require("../../validators/schemas/taskManagementSchema");
const { validate } = require("../../validators/validate");

const router = express.Router();

// Create Task
router.get("/getTaskTypeDropdown", getTaskTypeDropdown);
router.get("/getParentTaskDropdown", getParentTaskDropdown);
router.post(
  "/AOPT_TASK_INSUPD",
  validate(aoptTaskInsUpdSchema),
  AOPT_TASK_INSUPD,
);
router.get("/getUlbDropdown", getUlbDropdown);
router.post("/AOPT_TASKSTATUS_INSUPD", validate(aoptTaskStatusInsUpdSchema), AOPT_TASKSTATUS_INSUPD);
router.get("/getTaskList", getTaskList);

module.exports = router;
