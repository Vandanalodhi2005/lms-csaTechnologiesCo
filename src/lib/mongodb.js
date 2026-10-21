import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectWithFallback(primaryUri, fallbackUri, opts) {
  try {
    return await mongoose.connect(primaryUri, opts);
  } catch (primaryError) {
    if (fallbackUri && fallbackUri !== primaryUri) {
      console.warn(`[MongoDB] Primary connection failed (${primaryError.message}). Attempting fallback to: ${fallbackUri}`);
      return await mongoose.connect(fallbackUri, opts);
    }
    throw primaryError;
  }
}

async function dbConnect() {
  const primaryUri = process.env.MONGODB_URI || process.env.mongodb_url;
  const fallbackUri = process.env.LOCAL_MONGODB_URI || (primaryUri !== "mongodb://127.0.0.1:27017/lms-dev" ? "mongodb://127.0.0.1:27017/lms-dev" : null);

  if (!primaryUri) {
    const error = new Error("MONGODB_URI is not configured. Add it to .env.local to enable database features.");
    error.code = "MONGODB_URI_MISSING";
    throw error;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    };

    cached.promise = connectWithFallback(primaryUri, fallbackUri, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
export { dbConnect };
