const express = require("express");
const multer = require("multer");
const responseController = require("../controller/responseController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/submit-form/:slug", upload.any(), responseController.submitForm);

module.exports = router;
