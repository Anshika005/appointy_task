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

// PATCH update bookmark
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = verifyToken(authHeader)
    if (!userId) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, description, imageUrl, contentType } = await req.json()

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("synapse")
    const bookmarksCollection = db.collection("bookmarks")

    const result = await bookmarksCollection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      {
        $set: {
          title,
          description,
          imageUrl,
          contentType,
          updatedAt: new Date(),
        },
      },
    )

    await client.close()

    if (result.matchedCount === 0) {
      return Response.json({ error: "Bookmark not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Update bookmark error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE bookmark
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const result = await bookmarksCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    })

    await client.close()

    if (result.deletedCount === 0) {
      return Response.json({ error: "Bookmark not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Delete bookmark error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
