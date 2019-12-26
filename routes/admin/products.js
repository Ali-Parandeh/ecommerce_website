const express = require("express");
const router = express.Router();
const { handleErrors } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const { requireTitle, requirePrice } = require("./validators");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

/* 
NOTE: 
The multer middlware takes care of all parsing (text fields and images) so bodyparser is no longer used.admin
If the validation middlware is used before multer is called, it will not receive the parsed request and will throw an error.
Therefore, the order of middlewares used in the post router below matters! 
We need to encode image to base64 first then encode form title & price.
The post router below make use of all middlewares passed to app.use in index.js first then executes rest of the middlewares below.
 */
router.post(
  "/admin/products/new",
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    // NOTE: Base64 represents the string encoding for images.
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send("Submitted");
  }
);

module.exports = router;
