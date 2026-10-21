const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

loadEnvConfig(process.cwd());

const uri =
  process.env.MONGODB_URI ||
  process.env.mongodb_url ||
  "mongodb+srv://credentials_db_user:BcoQBcScdPImB6tq@cluster0.uovu4gp.mongodb.net/lms-dev";

async function seed() {
  await mongoose.connect(uri);
  const usersCol = mongoose.connection.collection("users");

  const adminHash = await bcrypt.hash("AdminPass123!", 12);
  const vandanaHash = await bcrypt.hash("Vandana@69", 12);
  const instructorHash = await bcrypt.hash("InstructorPass123!", 12);
  const studentHash = await bcrypt.hash("StudentPass123!", 12);

  // 1. Admin account: admin@edulearn.com
  await usersCol.updateOne(
    { email: "admin@edulearn.com" },
    {
      $set: {
        name: "Super Administrator",
        email: "admin@edulearn.com",
        passwordHash: adminHash,
        role: "admin",
        isActive: true,
        isEmailVerified: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 2. Admin account: vandanarajpoot69@gmail.com
  await usersCol.updateOne(
    { email: "vandanarajpoot69@gmail.com" },
    {
      $set: {
        name: "Vandana Rajpoot",
        email: "vandanarajpoot69@gmail.com",
        passwordHash: vandanaHash,
        role: "admin",
        isActive: true,
        isEmailVerified: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 3. Demo Instructor
  await usersCol.updateOne(
    { email: "instructor.sarah@edulearn.com" },
    {
      $set: {
        name: "Dr. Sarah Mitchell",
        email: "instructor.sarah@edulearn.com",
        passwordHash: instructorHash,
        role: "instructor",
        instructorApproved: true,
        isActive: true,
        isEmailVerified: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 4. Demo Student
  await usersCol.updateOne(
    { email: "student.alex@edulearn.com" },
    {
      $set: {
        name: "Alex Johnson",
        email: "student.alex@edulearn.com",
        passwordHash: studentHash,
        role: "student",
        isActive: true,
        isEmailVerified: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log("Successfully seeded users!");
  const all = await usersCol
    .find({}, { projection: { email: 1, role: 1, name: 1 } })
    .toArray();
  console.log("Current DB Users in MongoDB:", all);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
