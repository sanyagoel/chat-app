const express = require("express");
const path = require("path");
const rootDir = path.dirname(require.main.filename);
const app = express();
const homeRouter = require("./routes/home");
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "public")); // Point to 'public' for views

app.use(express.static(path.join(rootDir, "public")));

app.use("/", homeRouter);

const server = app.listen(3000, () => {
  console.log("using port 3000");
});
const clients = new Set();

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  clients.add(socket.id);
  io.emit("clients-total",clients.size);

  socket.on("join", (data) => {
    io.emit("welcome", { username: data.username });
    console.log(data.username, "joined the chat");
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
    console.log(data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback-server", data);
  });
  socket.on("disconnect",()=>{
    clients.delete(socket.id);
    io.emit("clients-total",clients.size);
  });
});
