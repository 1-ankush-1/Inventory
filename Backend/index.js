import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { Server } from "socket.io";
import {createServer} from "http"
import { add, remove, update, getOne, getAll } from "./Routes/Routes.js";
import {connect} from "./Config/Connect.js"
dotenv.config()

// initializing
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{ // Pass the server instance to SocketIO constructor
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

//connect mongodb
connect();

// Middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/getone",getOne)
app.get("/getAll",getAll)
app.post("/add", (req, res) => {add(req, res, io);});
app.put("/update/:id", (req, res) => {update(req, res, io);});
app.delete("/delete/:id",(req, res) => { remove(req, res, io);});

//connected client
io.on("connection", socket => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('deleteProduct', (data) => {
      console.log('deleteProduct event received', data); // Check if this message is logged when the client emits the event
      // ...
    });
    socket.on('updateProduct', (data) => {
      console.log('update event received', data); // Check if this message is logged when the client emits the event
      // ...
    });
    socket.on('addProduct', (data) => {
      console.log('add event received', data); // Check if this message is logged when the client emits the event
      // ...
    });
});

// starting express app
httpServer.listen(process.env.PORT || 5000, () => {
    console.log(`server running on port ${process.env.PORT || 5000}`);
  });

