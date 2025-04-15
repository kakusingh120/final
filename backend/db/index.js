import mongoose from "mongoose";

const dbconnect=async()=>{
    try{
        const URI = `${process.env.db_uri}/vidtube`
         mongoose.set('strictQuery', false);
      const connection  =  await  mongoose.connect(URI)
          console.log("Connected to the database:", connection.connection.host);
    }
    catch(error){
console.log("error has occoured in connecting with db",error)
    }
}
export default dbconnect;
