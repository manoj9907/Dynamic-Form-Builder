const express = require("express");
const router = express.Router();
const responseController = require("../controller/responseController");

// View all responses for a specific form
router.get("/admin/responses/:formId", responseController.getResponses);

// Export responses as CSV
router.get("/admin/export/csv/:formId", responseController.exportResponsesCSV);

// Export responses as Excel
router.get(
  "/admin/export/excel/:formId",
  responseController.exportResponsesExcel
);

// Filter/Search responses
router.get(
  "/admin/filter-responses/:formId",
  responseController.filterResponses
);

module.exports = router;
