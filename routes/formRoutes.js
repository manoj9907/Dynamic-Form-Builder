const express = require("express");
const Form = require("../models/Form");
const formController = require("../controller/formController");
const {
  verifyToken,
  isAdmin,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Render Admin Form Builder
router.get("/admin", (req, res) => {
  res.render("admin");
});
router.get("/getforms", formController.getFormlist);
router.post(
  "/admin/create-form",
  // verifyToken,
  // isAdmin,
  formController.createForm
);

router.get("/form/:slug", async (req, res) => {
  try {
    const form = await Form.findOne({ slug: req.params.slug });
    if (!form) return res.status(404).send("Form not found");

    res.render("dynamic-form", { form });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get("/admin/form", formController.getFormAdmin);
router.get("/form", formController.getForm);
router.get("/form/check/:slug", formController.getFormBySlug);
router.put("/forms/:id", formController.editForm);
router.delete("/forms/:id", formController.deleteForm);

module.exports = router;
