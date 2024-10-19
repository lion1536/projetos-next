const express = require("express");
const next = require("next");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const fetchIdBySession = async (req) => {
  const sessionId = req.sessionID;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.query(
    "SELECT data FROM sessions WHERE session_id = ?",
    [sessionId]
  );

  const sessionData = JSON.parse(rows[0].data);
  const email = sessionData.user ? sessionData.user.email : null;

  const [user] = await connection.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email]
  );

  connection.end();
  return user[0].user_id;
};

app.prepare().then(() => {
  const server = express();

  const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: { secure: !dev },
    })
  );

  server.use(express.json());

  server.post("/api/auth/signup", async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
    }

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      const [existingUser] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        connection.end();
        return res.status(422).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.query(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [email, hashedPassword, name]
      );

      connection.end();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  server.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      const [user] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (user.length === 0) {
        connection.end();
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user[0].password);

      if (!isPasswordValid) {
        connection.end();
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Optionally, set up a session or token here
      req.session.user = { id: user[0].id, email: user[0].email };
      connection.end();
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  server.post("/api/data/post", async (req, res) => {
    const { content } = req.body;

    if (!req.session.user) {
      res.status(401).json({ message: "Not authenticated" });
    }

    const userId = await fetchIdBySession(req);

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      await connection.query(
        "INSERT INTO posts (user_id, content) VALUES (?, ?)",
        [userId, content]
      );

      connection.end();
      res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  server.get("/api/data/profile-picture", async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      const [profilePicture] = await connection.query(
        "SELECT profile_picture FROM users WHERE user_id = ?",
        [userId]
      );

      connection.end();

      if (profilePicture.length === 0) {
        return res.status(404).json({ message: "Profile picture not found" });
      }

      const profilePicturePath = profilePicture[0].profile_picture;

      // Check if the file exists
      const fs = require("fs");
      if (!fs.existsSync(profilePicturePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Send the file
      res.sendFile(profilePicturePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  server.get("/api/auth/session", (req, res) => {
    if (req.session.user) {
      res.status(200).json({ user: req.session.user });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Handle all other routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server
    .listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    })
    .catch((ex) => {
      console.error(ex.stack);
      process.exit(1);
    });
});
