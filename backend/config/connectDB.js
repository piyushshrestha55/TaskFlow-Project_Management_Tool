import mongoose from "mongoose";

export const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  try {
    if (!URI) {
      throw new Error("MongoDB URI is not defined");
    }

    await mongoose.connect(URI);
    console.log("MongoDB connected succesfully");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
};
