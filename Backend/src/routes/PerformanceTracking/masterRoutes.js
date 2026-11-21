const express = require("express");
const { validate } = require("../../validators/validate");
const {
  AOPT_TASKTYPE_INSUPD,
  getTaskTypeList,
  getDepartmentDropdown,
  getEmployeeDropdown,
  AOPT_EMPLOYEE_MAPPING_INSUPD,
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

// Hierarchy mapping
router.get("/getDepartmentDropdown", getDepartmentDropdown);
router.get("/getEmployeeDropdown", getEmployeeDropdown);
router.post("/aopt_employee_mapping_insupd", AOPT_EMPLOYEE_MAPPING_INSUPD);

module.exports = router;
