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
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
    });
  }
  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));

  const name = data.name || "";
  const username = data.username || "";
  const password = data.password || "";
  const reqBody = { name, username, password };
  // let errors = {};
  if (username === "" || password === "") {
    res.status(400).send({
      res: "Fileds are required",
    });
  } else {
    if (username !== "") {
      Account.findOne({ username: username }, (err, result) => {
        if (result) {
          res.status(400).json({ res: "Already user exist", statusCode: 400 });
        } else {
          const account = new Account(data);
          account
            .save(account)
            .then((data) => {
              console.log(data, "data");
              res.status(200).send({ res: "Success", statusCode: 200 });
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Account.",
              });
            });
        }
      });
    }
  }
});

// login
router.post("/login", (req, res) => {
  console.log(JSON.parse(Buffer.from(req.body).toString("utf8")), "data");
  if (!req.body) {
    return res.status(400).send({
      message: "Data can not be empty!",
      statusCode:400
    });
  }
  let data = JSON.parse(Buffer.from(req.body).toString("utf8"));
  const username = data.username || "";
  const password = data.password || "";

  try {
    if (username == "" || password == "") {
      res.status(400).json({ result: "Username and Password are required" });
    } else {
      Account.findOne({ username: username }, (err, user) => {
        console.log(user, "user fin");
        if (user.password === password) {
          res.status(200).json({ result: "success",statusCode:200 });
        } else {
          res.status(400).json({ result: "fail",statusCode:400 });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
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
