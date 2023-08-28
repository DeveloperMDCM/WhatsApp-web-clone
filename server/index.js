import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { resolve } from "path";
import mysql from "mysql2";
import bodyParser from "body-parser";
import { PORT } from "./config.js";
import multer from "multer";
import cors from "cors";
// Initializations
let activeSessions  = 0;
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  pingTimeout: 600000, // 10 minutos
  // cors: {
  //   origin: "http://localhost:3000",
  // },
});

// https://github.com/DeveloperMDCM

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

app.use("/uploads", express.static(resolve("uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
  } else {
    console.log("Connected to the database");
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  const filename = req.file.filename;
  res.json({ filename });
});

// Ruta para verificar si el usuario existe
app.post("/check-username", (req, res) => {
  const { username } = req.body;
  const selectQuery = "SELECT * FROM users WHERE username = ?";

  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error("Error checking username: ", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const userExists = results.length > 0;
      res.status(200).json({ userExists });
    }
  });
});

// Ruta para registrar usuario 
app.post("/register", (req, res) => {
  const { username } = req.body;
  const insertQuery = "INSERT INTO users (username) VALUES (?)";
  db.query(insertQuery, [username], (err) => {
    if (err) {
      console.error("Error registering user: ", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "User registered successfully" });
    }
  });
});

// Ruta para obtener mensajes almacenados en la base de datos
app.get("/messages", (req, res) => {
  const selectQuery = "SELECT * FROM messages ORDER by created_at ";
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error fetching messages: ", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json(results);
    }
  });
});
// Configuracion socket.io

io.on("connection", (socket) => {
  console.log(activeSessions);
  activeSessions++;
  io.emit('activeSessions', activeSessions); // Emitir a todos los clientes

  socket.on('disconnect', () => {
    activeSessions--;
    io.emit('activeSessions', activeSessions); // Emitir a todos los clientes
  });

  socket.on("sendMessage", async (messages) => {
    const { username, message, edited, file_url } = messages;
    const sql =
      "INSERT INTO messages (user, message, edited, file_url) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, message, edited, file_url], (err, result) => {
      if (err) {
        console.error("Error inserting message:", err);
        return;
      }

      const insertedMessageId = result.insertId;
      const newMessage = {
        id: insertedMessageId,
        user: username, // Asegúrate de que el nombre de usuario se envíe correctamente
        message: message,
        edited,
        file_url: file_url,
      };
      console.log(newMessage);
      io.emit("messageReceived", newMessage);
    });
  });

  socket.on("editMessage", async ({ messageId, newText, username, image }) => {
    try {
      const query = "UPDATE messages SET message = ?, edited = 1 WHERE id = ?";
      const values = [newText, messageId, username, image];
      await dbQuery(query, values);

      const updatedMessage = {
        id: messageId,
        user: username,
        message: newText,
        edited: true,
        file_url: image,
      };

      io.emit("messageUpdated", updatedMessage);
      console.log(updatedMessage);
    } catch (error) {
      console.error("Error al editar el mensaje:", error);
      console.log(error);
    }
  });

});

server.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});

// Función para ejecutar consultas a la base de datos
function dbQuery(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}
