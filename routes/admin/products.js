const express = require("express");
const router = express.Router();
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");
const { validationResult } = require("express-validator");
const multer = require("multer");

router.get("/admin/products", (req, res) => {});
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

/* 
NOTE: 
The order of middlewares used in the post router below matters! We need to encode image to base64 first then encode form title & price.
The post router below make use of all middlewares passed to app.use in index.js first then executes rest of the middlewares below.
 */
router.post(
  "/admin/products/new",
  upload.single("image"),
  [requireTitle, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(productsNewTemplate({ errors }));
    }
    // NOTE: Base64 represents the string encoding for images.
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });

    res.send("Submitted");
  }
);

module.exports = router;
