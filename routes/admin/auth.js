const express = require("express");
const { handleErrors } = require("./middlewares");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const usersRepo = require("../../repositories/users");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser
} = require("./validators");

//  router is used for sub-routing (packaging) our routes.
const router = express.Router();

// req: incoming information to server from the browser. Use req when receiving information from the user
// res: outgoing response from the server to the browser. Use res to send info back to the user or interact with the browser.
// Listen for GET requests on the root route (/)
router.get("/signup", (req, res) => {
  // You can send a piece of text that is html using `` which will be rendered by the browser.
  // Note: The default method for form submission is GET so you need to overwrite this with a POST request.
  res.send(signupTemplate({ req }));
});

// Post route of the root route method to server first, server runs the appropriate callback, then chunk by chunk
// the browser sends the rest of the information to the server while receiving confirmation of each chunk
router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    // Create a user in the user repo to represent our user
    // Note: keys and values are identical so can shortern the code as below.
    const user = await usersRepo.create({ email, password });
    // Store the id of the user inside the user cookie.
    req.session.userId = user.id;
    res.send("Account Created");
  }
);

// Sign out route
router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out!");
});

// Sign in route (GET)
router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

// Sign in route (POST)
router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });
    req.session.userId = user.id;
    res.send("You are signed in!");
  }
);

module.exports = router;
