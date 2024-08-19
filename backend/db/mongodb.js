import mongoose from 'mongoose';

 const connectdb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connect DB Successfull`);
    } catch (error) {
        console.log(error);
    }
}

export default connectdb

