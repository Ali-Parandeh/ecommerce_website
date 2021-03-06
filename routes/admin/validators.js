const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Must be between 5 and 40 characters"),
  requirePrice: check("price")
    .trim()
    // NOTE: The server always receives the price as a string from the client browser so needs to be converted to a float.
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a number greater than 1"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async email => {
      // Checking whether a user already exists in the database.
      // NOTE: Can use usersRepo.getOneBy({email}) instead of usersRepo.getOneBy({email: email}) as key & value are identical
      // NOTE: Anywhere 'await' keyword is used in a function, the enclosing functions needs to be labled 'async'.
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email is already in use");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters"),
  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      } else {
        return true;
      }
    }),
  requireEmailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found!");
      }
    }),
  requireValidPasswordForUser: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid Password");
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error("Invalid password");
      }
    })
};
