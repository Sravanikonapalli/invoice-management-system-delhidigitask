const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "signup"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting:", err);
    return;
  }
  console.log("Connected as id " + db.threadId);
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error processing your request" });
    }

    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        console.error("Error saving user to database:", err);
        return res.status(500).json({ message: "Error creating user" });
      }
      return res.json({ message: "User created successfully" });
    });
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const sql = "SELECT * FROM login WHERE `email` = ?";
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Error logging in" });
    }

    if (data.length > 0) {
      const user = data[0];
      console.log("User found:", user);

      console.log("Plaintext password:", password);
      console.log("Hashed password from DB:", user.password);

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      console.log("Password valid:", isPasswordValid);

      if (isPasswordValid) {
        return res.json({ message: "Success" });
      } else {
        console.log("Password mismatch");
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      console.log("Email not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});



app.listen(8085, () => {
  console.log("Listening on port 8085");
});
