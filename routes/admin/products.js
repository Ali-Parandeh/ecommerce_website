const express = require("express");
const router = express.Router();
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");
const { validationResult } = require("express-validator");
const multer = require("multer");

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post("/admin/products/new", [requireTitle, requirePrice], (req, res) => {
  const errors = validationResult(req);

  res.send("Submitted");
});

module.exports = router;
