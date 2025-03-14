const express = require("express");
const Form = require("../models/Form");
const jwt = require("jsonwebtoken");

exports.createForm = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies); // 🔍 Debugging line
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({ error: "Unauthorized. No token found!" });
    }

    const token = req.cookies.token;
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, fields } = req.body;
    const parsedFields = JSON.parse(fields);

    const newForm = new Form({
      title,
      fields: parsedFields,
      userId,
    });

    await newForm.save();

    res.json({
      message: "Form created successfully!",
      formLink: `/form/${newForm.slug}`,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
};

exports.getForm = async (req, res) => {
  try {
    const forms = await Form.find();
    res.render("form-list-user", { forms });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getFormBySlug = async (req, res) => {
  try {
    const form = await Form.findOne({ slug: req.params.slug });
    if (!form) return res.status(404).send("Form not found");

    res.render("form-detail", { form });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.editForm = async (req, res) => {
  try {
    const { title, fields } = req.body;
    const parsedFields = JSON.parse(fields);

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { title, fields: parsedFields },
      { new: true }
    );

    if (!updatedForm) return res.status(404).send("Form not found");

    res.json({ message: "Form updated successfully", form: updatedForm });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).send("Form not found");

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
