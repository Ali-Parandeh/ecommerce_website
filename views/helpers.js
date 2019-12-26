module.exports = {
  getError(errors, prop) {
    // prop === 'email' || 'password' || 'passwordConfirmation'
    try {
      // errors.mapped() returns an object with each error mapped as key
      return errors.mapped()[prop].msg;
    } catch (err) {
      return "";
    }
  }
};
