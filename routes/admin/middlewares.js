// Grab on the validationResult function from object returned by requring express-validator.
const { validationResult } = require("express-validator");

module.exports = {
  handleErrors(templateFunc) {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send(templateFunc({ errors }));
      }
      // Move on executing the rest of route handler logic. All checks passed.
      next();
    };
  },

  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }

    next();
  }
};
