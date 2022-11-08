import express from "express";
import mysql from "mysql2";

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "1999_nico",
//   database: "demo-sql-injection",
// });

const db = mysql.createPool({
  connectionLimit: 100,
  host: "localhost", //This is your localhost IP
  user: "root", // "newuser" created in Step 1(e)
  password: "1999_nico", // password for the new user
  database: "injectiondb", // Database name
  port: "3306", // port name, "3306" by default
});
db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successful: " + connection.threadId);
});

const app = express();
const SERVER_PORT = 3001;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sql =
    'SELECT * FROM users WHERE username = "' +
    username +
    '" AND password = "' +
    password +
    '";';
  console.log(sql);

  db.query(sql, (err, result) => {
    if (result.length == 0) {
      console.log("User does not exist");
      res.redirect("/");
    } else {
      res.redirect("/dashboard");
    }
  });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.listen(SERVER_PORT, () => {
  console.log(`Server listen http://localhost:${SERVER_PORT}`);
});

// const sql =
//   "CREATE TABLE users (name VARCHAR(255), username VARCHAR(255), password VARCHAR(255))";

// connection.query(sql, (err, result) => {
//   if (err) throw err;
//   console.log("Tabla creada");
// });
