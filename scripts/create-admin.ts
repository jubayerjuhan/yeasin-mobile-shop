import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../lib/models/User";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yeasin-mobile-shop";

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);

  const email = "admin@yeasin.com";
  const password = "password123";

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log("Admin user already exists!");
    process.exit(0);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  await User.create({
    email,
    passwordHash,
    role: "ADMIN",
  });

  console.log(`Admin user created!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

createAdmin().catch(console.error);
