const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.DBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const formRoutes = require("./routes/formRoutes");
const authRoutes = require("./routes/authRoutes");
const responseRoutes = require("./routes/responseRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/", formRoutes);
app.use("/api", authRoutes);
app.use("/", responseRoutes);
app.use("/", adminRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
