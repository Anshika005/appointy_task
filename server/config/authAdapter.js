// server/config/authAdapter.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

/**
 * Adapter with default local auth using MongoDB 'users' collection and JWT.
 * If you want to plug in a different provider (OAuth, Auth0, etc), replace
 * the functions below with your provider logic and keep the same function names.
 */

let dbRef = null;
export function initAuthAdapter(db) {
  dbRef = db;
}

export async function registerLocal({ email, password, name }) {
  const users = dbRef.collection("users");
  const existing = await users.findOne({ email });
  if (existing) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, 10);
  const res = await users.insertOne({ email, password: hashed, name, createdAt: new Date() });
  return { id: res.insertedId, email, name };
}

export async function loginLocal({ email, password }) {
  const users = dbRef.collection("users");
  const u = await users.findOne({ email });
  if (!u) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) throw new Error("Invalid credentials");
  // create JWT
  const token = jwt.sign({ sub: u._id.toString(), email: u.email, name: u.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: u._id.toString(), email: u.email, name: u.name } };
}

export async function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const users = dbRef.collection("users");
    const u = await users.findOne({ _id: new ObjectId(payload.sub) }, { projection: { password: 0 } });
    if (!u) return null;
    return { id: u._id.toString(), email: u.email, name: u.name };
  } catch (e) {
    return null;
  }
}
