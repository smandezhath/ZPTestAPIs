const dbConfig = require("../config/db.config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

debugger;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

db.policies = require("./policy.model.js")(mongoose);
db.blog = require("./blog.model.js")(mongoose);
db.carreview = require("./carreview.model.js")(mongoose);
db.movierating = require("./movierating.model.js")(mongoose);

module.exports = db;
