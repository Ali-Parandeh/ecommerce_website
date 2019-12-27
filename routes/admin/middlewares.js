// Grab on the validationResult function from object returned by requring express-validator.
const { validationResult } = require("express-validator");

module.exports = {
  // NOTE: The callback function dataCb is only required if there are errors to be handled.
  handleErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // NOTE: Need to define data with let outside of nested if statment to be able to access & change it in the nested if.
        // NOTE: Need to declare data as an empty object so that it is not undefined if dataCb is undefined.
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }

        // NOTE: ...data takes key-value pairs from data and merges it into existing errors key-value pairs
        return res.send(templateFunc({ errors, ...data }));
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
