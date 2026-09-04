import mongoose from "mongoose"

const mongodbUrl = process.env.MONGODB_URL

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null } | undefined
}

let cached = global.mongooseConn
if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null }
}

const connectDb = async () => {
  if (!mongodbUrl || mongodbUrl.includes("add your mongo db url") || mongodbUrl.trim() === "") {
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl, {
      serverSelectionTimeoutMS: 5000,
    }).then(c => c.connection)
  }

  try {
    const conn = await cached.promise
    return conn
  } catch (error) {
    console.error("MongoDB connection error:", error)
    cached.promise = null
    return null
  }
}

export default connectDb