import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || "";
const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function verifyToken(token: string): string | null {
  try {
    const bearerToken = token.replace("Bearer ", "");
    const payload = jwt.verify(bearerToken, JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let mongoClient: MongoClient | null = null;

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = verifyToken(authHeader);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "Query required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db("synapse");
    const bookmarksCollection = db.collection("bookmarks");

    const bookmarks = await bookmarksCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();

    const bookmarkTexts = bookmarks
      .map(
        (b) =>
          `ID: ${b._id}, Title: ${b.title || ""}, Description: ${
            b.description || ""
          }, URL: ${b.url || ""}`
      )
      .join("\n");

    const prompt = `You are a search assistant. Given these bookmarks:\n\n${bookmarkTexts}\n\nFind ones relevant to the query "${query}". Respond ONLY as a JSON array of {id, title, reason}.`;

    // 🔥 Call Claude (Anthropic API)
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Claude API error:", aiResponse.status, errorText);
      return new Response(JSON.stringify({ error: "Claude API call failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();

    // Extract model response text safely
    let textResponse = "";
    if (data?.content && Array.isArray(data.content) && data.content.length > 0) {
      textResponse = data.content[0].text ?? "";
    } else if (typeof data?.completion === "string") {
      textResponse = data.completion;
    } else {
      textResponse = JSON.stringify(data);
    }

    // Try to parse a JSON array from Claude's response
    let results: any[] = [];
    const match = textResponse.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        results = JSON.parse(match[0]);
      } catch {
        results = [];
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI search error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (mongoClient) {
      await mongoClient.close().catch(() => {});
    }
  }
}
