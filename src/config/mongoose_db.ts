import mongoose from "mongoose";

async function connectToMongoose() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL!);
  } catch (error) {
    console.log(error);
  }
}

mongoose.connection.on("error", (e) => {
  console.log("Mongoose Error:", e);
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to database");
});

export default connectToMongoose;
