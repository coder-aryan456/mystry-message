import mongoose from "mongoose";
type ConntionObject={
    isConnected?:number
}
const connection: ConntionObject={}// creating an instance
export async function dbConnect():Promise<void>{
if(connection.isConnected) {
    console.log("already connected to database");
    return
}
try {
    const db= await mongoose.connect(process.env.MONGODBURI || '')
    connection.isConnected=db.connections[0].readyState
    console.log("Db connected sccessfully")
} catch (error) {
    console.log(error,"database connection failed")
    process.exit(1)
}
}
//re_N5TuZtjS_C12zqV3PfRWNa71Z2VWZiJ6Y
