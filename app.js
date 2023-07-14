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
app.get("/booking", (req, res) => {
  res.render("booking");
  //render the booking-in page here
});
app.post("/booking", (req, res) => {
  // get data - body-parser **
  // check if confirm pass & password match **
  // check if email is already used/ existing **
  // encrypt password / create a hash **
  // store all details in db - insert statement
  // console.log(req.body)

  if (req.body.password === req.body.confirm) {
    db.query(
      "SELECT email FROM clients WHERE email = ?",
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
              "INSERT INTO clients(client_id,first_name,last_name,address,city,car_model,telephone,email,password,DEALERNAME) values(?,?,?,?,?,?,?,?,?,?)",
              [
                req.body.client_id,
                req.body.first_name,
                req.body.last_name,
                req.body.address,
                req.body.city,
                req.body.car_model,
                req.body.telephone,
                req.body.email,
                hash,
                req.body.DEALERNAME,
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
// route for the sign -up page
app.get("/sign-in", (req, res) => {
  res.render("sign-in");
  //render the sign-up page here
});

app.post("/sign-in", (req, res) => {
  // confirm that email is registered
  // compare password provided with the hash in db

  db.query(
    "SELECT * FROM clients WHERE email = ?",
    [req.body.email],
    (error, results) => {
      // handle error
      if (results.length > 0) {
        //proceed
        bcrypt.compare(req.body.password, results[0].password, (err, match) => {
          if (match) {
            // create session
            // console.log(results)
            req.session.user = results[0];
            // console.log(req.sessionID)
            res.redirect("booking");
          } else {
            res.render("sign-in", {
              error: true,
              errorMessage: "Incorrect Password",
            });
          }
        });
      } else {
        res.render("sign-up", {
          error: true,
          errorMessage: "Email not registered.",
        });
      }
    }
  );
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up");
  //render the sign-in page here
  // create a session req.session.user
});

app.post("/sign-up", (req, res) => {
  // get data - body-parser **
  // check if confirm pass & password match **
  // check if email is already used/ existing **
  // encrypt password / create a hash **
  // store all details in db - insert statement
  // console.log(req.body)

  if (req.body.password === req.body.confirm) {
    db.query(
      "SELECT email FROM clients WHERE email = ?",
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
              "INSERT INTO clients(client_id,first_name,last_name,address,city,car_model,telephone,email,password,DEALERNAME) values(?,?,?,?,?,?,?,?,?,?)",
              [
                req.body.client_id,
                req.body.first_name,
                req.body.last_name,
                req.body.address,
                req.body.city,
                req.body.car_model,
                req.body.telephone,
                req.body.email,
                hash,
                req.body.DEALERNAME,
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
