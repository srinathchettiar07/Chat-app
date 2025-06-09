import mongoose, { mongo } from 'mongoose';

export const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connection established on ${connect.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}