const express = require("express");
const Form = require("../models/Form");
const Response = require("../models/Response");
const { Parser } = require("json2csv");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

exports.submitForm = async (req, res) => {
  try {
    // 🔹 Check if token exists in cookies
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    // 🔹 Verify JWT Token
    const token = req.cookies.token;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const userId = decoded.id;

    // 🔹 Get form by slug
    const { slug } = req.params;
    const form = await Form.findOne({ slug });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    let responseData = {};

    // 🔹 Validate form fields
    for (let field of form.fields) {
      if (field.type === "checkbox") {
        responseData[field.label] = req.body[field.label] || [];
      } else if (field.type === "file") {
        // Handle file uploads properly
        if (!req.files || !req.files.length) {
          if (field.required) {
            return res
              .status(400)
              .json({ message: `${field.label} is required` });
          }
          responseData[field.label] = null;
        } else {
          const uploadedFile = req.files.find(
            (file) => file.fieldname === field.label
          );
          responseData[field.label] = uploadedFile ? uploadedFile.path : null;
        }
      } else {
        // 🔹 Check required fields
        if (
          field.required &&
          (!req.body[field.label] || req.body[field.label].trim() === "")
        ) {
          return res
            .status(400)
            .json({ message: `${field.label} is required` });
        }
        responseData[field.label] =
          req.body[field.label] || field.defaultValue || null;
      }
    }

    // 🔹 Save response to the database
    const response = new Response({
      formId: form._id,
      userId,
      responses: responseData,
    });

    await response.save();

    res.status(200).json({ message: "Response submitted successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findOne({ slug: formId });
    if (!form) return res.status(404).send("Form not found");

    const responses = await Response.find({ formId: form._id });

    res.render("responses-list", { form, responses });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.exportResponsesCSV = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await Response.find({ formId });

    if (responses.length === 0)
      return res.status(404).send("No responses found");

    const fields = Object.keys(responses[0].responses);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(responses.map((r) => r.responses));

    res.header("Content-Type", "text/csv");
    res.attachment(`form_${formId}_responses.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.exportResponsesExcel = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findOne({ slug: formId });
    if (!form) return res.status(404).send("Form not found");
    const responses = await Response.find({ formId: form._id }).lean();
    if (responses.length === 0)
      return res.status(404).send("No responses found");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Responses");
    const headers = Object.keys(responses[0].responses);
    worksheet.addRow(["Submitted At", ...headers]);
    console.log("worksheet");
    responses.forEach((response) => {
      const row = [
        response.submittedAt,
        ...headers.map((field) => response.responses[field] || ""),
      ];
      worksheet.addRow(row);
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=form_${formId}_responses.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel Export Error:", error);
    res.status(500).send(error.message);
  }
};

exports.filterResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const { startDate, endDate, searchField, searchValue } = req.query;

    let filter = { formId };

    if (startDate && endDate) {
      filter.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (searchField && searchValue) {
      filter[`responses.${searchField}`] = new RegExp(searchValue, "i");
    }

    const responses = await Response.find(filter);
    res.json(responses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
