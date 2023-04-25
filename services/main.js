const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chid",
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db conn successful(main service)");
  }
});

module.exports = db;
