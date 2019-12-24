const layout = require("../layout");
// helper function for error handling
const getError = (errors, prop) => {
  // prop === 'email || 'password' || 'passwordConfirmation'
  try {
    // errors.mapped() returns an object with each error mapped as key
    return errors.mapped()[prop].msg;
  } catch (err) {
    return "";
  }
};

// Exporting template with req object. {req} destructures the argument.
module.exports = ({ req }, errors) => {
  return layout({
    content: `        
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email">
                ${getError(errors, "email")}
                <input name="password" placeholder="password">
                ${getError(errors, "password")}
                <input name="passwordConfirmation" placeholder="password confirmation">
                ${getError(errors, "passwordConfirmation")}
                <button>Sign up</button>
            </form>
        </div>
    `
  });
};
