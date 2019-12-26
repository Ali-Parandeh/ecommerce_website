const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async create(attrs) {
    // attrs === {email: '', password: ''}
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");

    // NOTE: The crypto.scrypt hasing function requires a callback to work. This means
    // we need to provide all the code within this callback to have acccess to 'hashed' variable.
    // Instead we use node.js core utils function to promisify the hashing function below.
    // crypto.scrypt(attrs.password, salt, 64, (err, buf) =>
    // {
    //     const hashed = buf.toString('hex');
    // });

    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      // Create a new object, take the properties of attrs then
      // overwrite the existing value of password key with the given password value
      ...attrs,
      password: `${buf.toString("hex")}.${salt}`
    };

    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    // Saved -> password saved in our database 'hashed.salt'
    // supplied -> password given to us by the user trying to sign in
    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString("hex");
  }
}

module.exports = new UsersRepository("users.json");
