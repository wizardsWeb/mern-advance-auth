import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);

        // console.log(`MongoDB Connected: ${con.connection.host}`)
        // MongoDB Connected: cluster0-shard-00-00.k6ncx.mongodb.net

        console.log("Connected to the MongoDB Successfully");
    }
    catch (error) {
        console.log('Error connection to MongoDB ', error.message);
        process.exit(1); // 1 is failure, 0 status code is success
    }
}