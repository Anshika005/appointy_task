import { MongoClient } from "mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || ""
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("synapse")
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      await client.close()
      return Response.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, {
      expiresIn: "7d",
    })

    await client.close()

    return Response.json({ token, user: { id: result.insertedId, email } }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
