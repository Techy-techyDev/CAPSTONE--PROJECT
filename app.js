const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");

const app = express();

//view engine set up

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "techy ",
    resave: false,
    saveUninitialized: true,
  })
);
const db = require("./services/main");

db.query("SELECT * FROM dealers", (error, data) => {
  console.log("data ", data);
});
// common js modules

//route for the "book service"button
app.get("/", (req, res) => {
  res.render("home");
  //render the sign-up page here
});
app.get("/book-sevice", (req, res) => {
  if (req.session.user) {
    //if the user is already logged in,redirect to the booking page

    res.redirect("/booking");
  } else {
    //if the user is not logged in redirect to the sign-up page
    res.redirect("/sign-in");
  }
});
//route for the sign -up page
app.get("/sign-up", (req, res) => {
  res.render("sign-up");
  //render the sign-up page here
});
app.get("/sign-in", (req, res) => {
  res.render("sign-in");
  //render the sign-in page here
  // create a session req.session.user
});

app.post("/sign-up", (req, res) => {
  const username = req.body.username;
  if (req.body.password === req.body.confirm) {
    db.query(
      "SELECT registration_no FROM dealers WHERE registration_no = ?",
      [req.body.email],
      (err, results) => {
        if (results.length > 0) {
          // email exist in db
          res.render("sign-up", {
            error: true,
            errorMessage: "Email already exists. Use another or login",
          });
        } else {
          bcrypt.hash(req.body.password, 4, function (err, hash) {
            // we have access to the hashed pass as hash
            db.query(
              "INSERT INTO dealers(dealer_id,DEALERNAME,TOWN,TELEPHONE,registration_no,password) values(?,?,?,?,?,?)",
              [
                req.body.dealer_id,
                req.body.DEALERNAME,
                req.body.TOWN,
                req.body.TELEPHONE,
                req.body.registration_no,
                hash,
              ],
              (error) => {
                if (error) {
                  res.render("sign-up", {
                    error: true,
                    errorMessage:
                      "Contact Admin, and tell them something very terrible is going on in the server",
                  });
                } else {
                  res.redirect("/sign-in"); // sucessful signup
                }
              }
            );
          });
        }
      }
    );
  } else {
    res.render("sign-up", {
      error: true,
      errorMessage: "Password and confirm Password do not match",
    });
  }
});

app.listen(3000, () => {
  console.log("app running!!...");
});
