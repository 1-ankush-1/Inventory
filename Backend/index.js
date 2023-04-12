import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { add, remove, update, getOne, getAll } from "./Routes/Routes.js";
import {connect} from "./Config/Connect.js"

//configuration of dotenv
dotenv.config();

//initializing 
const app = express();

//connect to mongodb
connect();

//Middlewares
app.use(cors);
app.use(express.json());

//routes
app.get("/getall",getAll);
app.get("/getOne/:id",getOne)
app.post("/add",add);
app.put("/update/:id",update);
app.delete("/delete/:id",remove);

//starting express app
app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`server running on port ${process.env.PORT}`)
})