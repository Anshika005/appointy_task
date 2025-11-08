import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

// NOTE: Avoid hardcoding the API key in the code. Rely on environment variables.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "your-gemini-key-here"
const MONGODB_URI = process.env.MONGODB_URI || ""
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

function verifyToken(token: string) {
  try {
    const bearerToken = token.replace("Bearer ", "")
    return (jwt.verify(bearerToken, JWT_SECRET) as { userId: string }).userId
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const userId = verifyToken(authHeader)
    if (!userId) return Response.json({ error: "Invalid token" }, { status: 401 })

    const { query } = await req.json()
    if (!query) return Response.json({ error: "Query required" }, { status: 400 })

    const mongoClient = new MongoClient(MONGODB_URI)
    await mongoClient.connect()
    const db = mongoClient.db("synapse")
    const bookmarksCollection = db.collection("bookmarks")

    const bookmarks = await bookmarksCollection.find({ userId: new ObjectId(userId) }).toArray()

    const bookmarkTexts = bookmarks
      .map((b) => `ID: ${b._id}, Title: ${b.title}, Description: ${b.description}, URL: ${b.url}`)
      .join("\n")

    // 🚨 FIX APPLIED HERE: Changed "gemini-1.5-flash-latest" to "gemini-2.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are a search assistant. Given these bookmarks:\n\n${bookmarkTexts}\n\nFind ones relevant to the query "${query}". Respond ONLY as JSON array of {id, title, reason}.`

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    })

    const textResponse = result.response.text()
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/)
    const results = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    await mongoClient.close()
    return Response.json({ results })
  } catch (error) {
    console.error("AI search error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}