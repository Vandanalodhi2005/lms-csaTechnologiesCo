const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

loadEnvConfig(process.cwd());

function readHidden(prompt) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal to enter the password securely.");
  }

  process.stdout.write(prompt);
  input.setRawMode(true);
  input.resume();

  return new Promise((resolve, reject) => {
    let value = "";

    function finish(error) {
      input.removeListener("data", onData);
      input.setRawMode(false);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    }

    function onData(buffer) {
      const character = buffer.toString("utf8");
      if (character === "\u0003") {
        finish(new Error("Password setup cancelled."));
      } else if (character === "\r" || character === "\n") {
        finish();
      } else if (character === "\u007f" || character === "\b") {
        value = value.slice(0, -1);
      } else if (character >= " ") {
        value += character;
      }
    }

    input.on("data", onData);
  });
}

async function main() {
  const emailIndex = process.argv.indexOf("--email");
  const email = emailIndex >= 0 ? process.argv[emailIndex + 1]?.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Provide the administrator email with --email <address>.");
  }

  const mongoUri = process.env.MONGODB_URI || process.env.mongodb_url;
  if (!mongoUri) {
    throw new Error("Set MONGODB_URI in .env.local before resetting the administrator.");
  }

  const password = await readHidden("New administrator password (12+ chars): ");
  const confirmation = await readHidden("Confirm new password: ");
  if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    throw new Error("Use at least 12 characters with uppercase, lowercase, and a number.");
  }
  if (password !== confirmation) {
    throw new Error("The passwords do not match.");
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  const users = mongoose.connection.collection("users");
  const passwordHash = await bcrypt.hash(password, 12);
  await users.updateOne(
    { email },
    {
      $set: {
        email,
        passwordHash,
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
        name: "Administrator",
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log(`Administrator account created or reset for ${email}. Password was not displayed.`);
  console.log("Sign in at http://localhost:3000/admin/login.");
}

main()
  .catch((error) => {
    console.error(`Admin reset failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
