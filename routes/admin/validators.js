const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireEmail: check("email")
    .trim()
    .normalizeEmail() //
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async email => {
      // Checking whether a user already exists in the database.
      // Note: Can use usersRepo.getOneBy({email}) instead of usersRepo.getOneBy({email: email}) as key & value are identical
      // Note: Anywhere 'await' keyword is used in a function, the enclosing functions needs to be labled 'async'.
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
      }
    })
};
