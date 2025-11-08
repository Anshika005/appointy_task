import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// NOTE: Avoid hardcoding the API key in the code. Rely on environment variables.
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || "your-claude-key-here";
const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function verifyToken(token: string) {
  try {
    const bearerToken = token.replace("Bearer ", "");
    return (jwt.verify(bearerToken, JWT_SECRET) as { userId: string }).userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(authHeader);
    if (!userId) return Response.json({ error: "Invalid token" }, { status: 401 });

    const { query } = await req.json();
    if (!query) return Response.json({ error: "Query required" }, { status: 400 });

    const mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db("synapse");
    const bookmarksCollection = db.collection("bookmarks");

    const bookmarks = await bookmarksCollection.find({ userId: new ObjectId(userId) }).toArray();

    const bookmarkTexts = bookmarks
      .map((b) => `ID: ${b._id}, Title: ${b.title}, Description: ${b.description}, URL: ${b.url}`)
      .join("\n");

    const prompt = `You are a search assistant. Given these bookmarks:\n\n${bookmarkTexts}\n\nFind ones relevant to the query "${query}". Respond ONLY as JSON array of {id, title, reason}.`;

    // ✅ REPLACEMENT STARTS HERE (Claude API instead of Gemini)
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229", // or "claude-3-sonnet-20240229"
        max_tokens: 500,
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await aiResponse.json();
    const textResponse = data?.content?.[0]?.text || "";
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
    const results = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    await mongoClient.close();
    return Response.json({ results });
  } catch (error) {
    console.error("AI search error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
