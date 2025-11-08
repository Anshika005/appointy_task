import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: Request) {
  try {
    const { url, content, title } = await req.json()

    if (!url && !content) {
      return Response.json({ error: "URL or content required" }, { status: 400 })
    }

    // Define the model configuration
    const modelConfig: any = { 
        model: "gemini-2.5-flash" // Using 2.5 is generally recommended over 1.5
    };
    
    // 🚨 FIX: If a URL is provided, enable the Google Search tool for grounding.
    // This allows the model to access the content of the live URL.
    if (url && !content) {
        modelConfig.config = {
            tools: [{ googleSearch: {} }]
        };
    }

    const model = genAI.getGenerativeModel(modelConfig)
    
    // Construct the prompt based on what data is available
    const prompt = `
        Please provide a concise summary (2-3 sentences) of the following content. 
        Make it engaging and informative.
        ${title ? ` Title: ${title}` : ""} 
        
        ${content ? `Content to summarize: ${content}` : url ? `Article URL to summarize: ${url}` : ""}
    `.trim()

    const result = await model.generateContent(prompt)
    const response = result.response
    const summary = response.text()

    return Response.json({ summary })
  } catch (error) {
    console.error("AI summarize error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}