import mongoose from 'mongoose'

export const connectDB = async () =>{
    try {
       const uri = process.env.MONGODB_URI || process.env.MONGO_URI
       const conn =  await mongoose.connect(uri)
        console.log("mongo uri = ", uri)
        console.log("MongoDB connected = ", conn.connection.host)

    } catch (error) {
        console.log("MongoDB connection error = ", error)
        process.exit(1)
    }
}

 