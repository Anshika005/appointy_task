import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const MONGODB_URI = process.env.MONGODB_URI || ""
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyToken(token: string) {
  try {
    const bearerToken = token.replace("Bearer ", "")
    const decoded = jwt.verify(bearerToken, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

// GET all bookmarks for authenticated user
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = verifyToken(authHeader)
    if (!userId) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("synapse")
    const bookmarksCollection = db.collection("bookmarks")

    const bookmarks = await bookmarksCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    await client.close()

    return Response.json(bookmarks)
  } catch (error) {
    console.error("Fetch bookmarks error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST new bookmark
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = verifyToken(authHeader)
    if (!userId) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const { url, title, description, imageUrl, contentType } = await req.json()

    if (!url || !title) {
      return Response.json({ error: "URL and title required" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("synapse")
    const bookmarksCollection = db.collection("bookmarks")

    const result = await bookmarksCollection.insertOne({
      userId: new ObjectId(userId),
      url,
      title,
      description,
      imageUrl,
      contentType: contentType || "article",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await client.close()

    return Response.json({ id: result.insertedId, url, title, description, imageUrl, contentType }, { status: 201 })
  } catch (error) {
    console.error("Create bookmark error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
