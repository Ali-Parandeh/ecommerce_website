const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  // NOTE: The repository methods implemented below are inefficient as they grab the whole database, manipulate it,
  // then overwrite the database JSON file. They also implement iterators which must be avoided in production code.
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }

    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  async writeAll(records) {
    // Write updated records back to this.filename.
    // Options passed in to JSON.stringify are replacer and spacers.
    // These options are passed in to prettify the ourput json file.

    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  async getOne(id) {
    // No need to check if id exists or not as it's up to the developer using this
    // method to perform his checks. The purpose of this method is to return an id
    // in the database if id exists.

    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    // const record = {email: 'test@test.com'}
    // const attrs = {password: 'myPassword'}
    // Object.assign updates the record with new attributes
    Object.assign(record, attrs);
    // const record = {email: 'test@test.com', password: 'myPassword'}

    return await this.writeAll(records);
  }

  async getOneBy(filters) {
    // This is a very rudimentary and inefficient code O(N^2). This is not a production ready filtering method
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (filters[key] !== record[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
};

// const test = async () =>
// {
//     const repo = new UsersRepository('users.json');
//     // await repo.create({email: 'testing@test.com', passowrd: 'goodPassword'});
//     // await repo.delete('9da27199')
//     // const users = await repo.getAll();
//     // await repo.delete('a220e7d0');
//     // const user  = await repo.getOne('a220e7d0');
//     // await repo.update('1f384c986', {password: 'myUpdatedPassword'});
//     // console.log(user);

//     const record = await repo.getOneBy({email: 'test@test.com', password: 'myUpdatedPassword'});
//     console.log(record);
// }

// test()
