const express = require("express");
const serverless = require("serverless-http");

const db = require("./models");
const Account = db.account;
const router = express.Router();

const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// Create a new account
router.post("/signup", (req, res) => {
  debugger;

  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  debugger;

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const name = data.name || "";
  const username = data.username || "";
  const password = data.password;
  const reqBody = { name, username, password };
  let errors = {};
  // Object.keys(reqBody).forEach(async (field) => {
  //   if (reqBody[field] === "") {
  //     errors = { ...errors, [field]: "This field is required" };
  //   }
  //   if (field === "username") {
  //     const value = reqBody[field];
  //     const { error, isUnique } = await checkUserUniqueness(field, value);
  //     if (!isUnique) {
  //       errors = { ...errors, ...error };
  //     }
  //   }
  //   if (field === "password" && password !== "" && password < 6) {
  //     errors = { ...errors, [field]: "Password is too short" };
  //   }
  // });
  if (Object.keys(errors).length > 0) {
    res.json({ errors });
  }

  debugger;
  const account = new Account(data);
  account
    .save(account)
    .then((data) => {
      debugger;
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Account.",
      });
    });
});

// login
router.post("/login", (req, res) => {
  debugger;

  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const account = new Account(data);

  account
    .save(account)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Blog.",
      });
    });
});

router.post("/profile", (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }

  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const blog = new Blog(data);
  blog
    .save(blog)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Blog.",
      });
    });
});

app.use(`/.netlify/functions/account`, router);

module.exports = app;
module.exports.handler = serverless(app);
