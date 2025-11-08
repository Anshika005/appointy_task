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

    const user = await usersCollection.findOne({ email })
    if (!user) {
      await client.close()
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      await client.close()
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
      expiresIn: "7d",
    })

    await client.close()

    return Response.json({ token, user: { id: user._id, email } }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
