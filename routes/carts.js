const express = require("express");
const router = express.Router();
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

// Recieve a POST request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  // Figure out the cart
  let cart;
  if (!req.session.cartId) {
    // We don't have a cart and we need to create one
    // We also need to store the newly created cartId on req.session.cartId
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart so let's get it from the carts reposiroty
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(item => item.id === req.body.productId);

  if (existingItem) {
    // Increment quantity for existing product
    existingItem.quantity++;
  } else {
    // Add a new product to the items array of the cart
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  // Update the carts repo with updated items in the cart
  await cartsRepo.update(cart.id, {
    items: cart.items
  });

  res.redirect("/cart");
});

// Recieve a GET request to show all items in a cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    // item === {id: '', quantity: ''}
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

// Recieve a POST request to delete and item for a cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter(item => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });

  res.redirect("/cart");
});

module.exports = router;
