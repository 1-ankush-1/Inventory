import mongoose from "mongoose";
import dotnev from "dotenv"

export const connect = ()=>{
    try{
        dotnev.config();
        mongoose.set("strictQuery",false)
        mongoose.connect(process.env.DATABASE)
    }catch(err){
        console.log(err)
    }   
    
}