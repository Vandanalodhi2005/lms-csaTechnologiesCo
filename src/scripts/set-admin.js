const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

loadEnvConfig(process.cwd());

const ADMIN_EMAIL = "vandanarajpoot69@gmail.com";
const ADMIN_PASS = "Vandana@69";
const ADMIN_NAME = "Vandana Rajpoot";

const uris = [
  process.env.MONGODB_URI,
  process.env.mongodb_url,
  "mongodb+srv://credentials_db_user:BcoQBcScdPImB6tq@cluster0.uovu4gp.mongodb.net/lms-dev",
  "mongodb://127.0.0.1:27017/lms-dev",
].filter(Boolean);

// Unique URIs
const uniqueUris = Array.from(new Set(uris));

async function setAdminOnDb(uri) {
  const isAtlas = uri.startsWith("mongodb+srv");
  console.log(`\nConnecting to database: ${isAtlas ? "MongoDB Atlas" : "Local MongoDB"}`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const usersCol = mongoose.connection.collection("users");
    const hash = await bcrypt.hash(ADMIN_PASS, 12);

    await usersCol.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          passwordHash: hash,
          role: "admin",
          isActive: true,
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
          emailVerificationSentAt: null,
          passwordResetToken: null,
          passwordResetExpires: null,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const doc = await usersCol.findOne({ email: ADMIN_EMAIL });
    const passwordValid = await bcrypt.compare(ADMIN_PASS, doc.passwordHash);

    console.log(`[SUCCESS] Admin account verified on ${isAtlas ? "Atlas" : "Local"}:`);
    console.log(`  - Email: ${doc.email}`);
    console.log(`  - Role: ${doc.role}`);
    console.log(`  - Verified: ${doc.isEmailVerified}`);
    console.log(`  - Active: ${doc.isActive}`);
    console.log(`  - Password Valid: ${passwordValid}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error(`[ERROR] Failed to update admin on ${uri}:`, error.message);
  }
}

async function main() {
  console.log("Setting Admin credentials...");
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASS}`);

  for (const uri of uniqueUris) {
    await setAdminOnDb(uri);
  }

  console.log("\nAdmin setup complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
