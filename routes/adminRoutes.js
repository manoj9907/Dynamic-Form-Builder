const express = require("express");
const router = express.Router();
const responseController = require("../controller/responseController");

router.get("/admin/responses/:formId", responseController.getResponses);

router.get("/admin/export/csv/:formId", responseController.exportResponsesCSV);

router.get(
  "/admin/export/excel/:formId",
  responseController.exportResponsesExcel
);

router.get(
  "/admin/filter-responses/:formId",
  responseController.filterResponses
);

module.exports = router;
