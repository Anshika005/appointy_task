# 🧠 Synapse — Your Visual Memory of the Web

Synapse is a modern, AI-powered bookmark management application designed to help you **capture, organize, and rediscover your digital world** — beautifully and intelligently.

Built with **Next.js, MongoDB, and Gemini/Claude AI**, Synapse provides a clean, seamless, and intuitive experience for managing and exploring your saved web resources.

---

## 🚀 Flow of the Application

### 🟣 1. Authentication — Login & Signup
The journey begins with a **secure login/signup system**:
- Users can sign up with email and password.  
- Authentication is handled using **JWT tokens** stored securely in `localStorage`.  
- Passwords are hashed using **bcryptjs** before saving in MongoDB.  
- **Claude API** supports secure GET and POST operations for authentication routes.

Once logged in, the user is redirected to their personalized **dashboard**.

---

### 🟢 2. Dashboard — Clean, Minimal, and Responsive UI/UX
After authentication, users land on a **visually clean dashboard** with:
- A **card-based bookmark grid** (each card shows an image, title, and description).  
- Quick actions like *Open*, *Edit*, and *Delete*.  
- A **unified search bar** and **AI-powered search** button.  
- Fully responsive layout with smooth animations (built using **Tailwind CSS** and **shadcn/ui**).

🖼️ **Example — Dashboard**

![Dashboard Screenshot](<img width="1917" height="907" alt="Screenshot 2025-11-08 172847" src="https://github.com/user-attachments/assets/413ba85c-45b4-4f12-8022-9fa23d8dc3b1" />
72847.png>)

> Displays bookmarks such as:
> - *Ikigai* → A book summary link  
> - *Penguin* → Image from Pexels  
> - *Oneshot* → YouTube video link

---

### 🔵 3. Adding Bookmarks — Your Visual Memory
You can easily **add a new bookmark** by clicking “Add Bookmark”:
- Provide a **URL**, **Title**, **Description**, and optional **Image URL**.  
- Choose a **Content Type** — Article, Product, Video, Research, or Inspiration.  
- Data is saved to MongoDB through the **Claude API (POST /api/bookmarks)** endpoint.

Bookmarks are displayed instantly on the dashboard with **beautiful preview cards**.

🖼️ **Example — Add/Edit Bookmark Modal**

![Add Bookmark Screenshot](<img width="1915" height="909" alt="Screenshot 2025-11-08 173128" src="https://github.com/user-attachments/assets/42d95aab-3670-42dc-bbde-68984b0389ed" />
ot 2025-11-08 173128.pngYOUR_ADD_BOOKMARK_IMAGE_URI>)

---

### 🤖 4. AI-Powered Search — Powered by Gemini
Synapse integrates **Gemini API** for **Natural Language Search** across your bookmarks.

When you search using plain text (e.g., *“white”*), Gemini understands context and fetches **semantically relevant results** — even if exact matches don’t exist.

🧩 **Example:**
> Query: **white**  
> Result: **Penguin** — because penguins are black and white, making them contextually related to the color “white”.

This intelligence comes from the prompt used:
```js
const prompt = `You are a search assistant. 
Given these bookmarks:\n\n${bookmarkTexts}\n\n
Find ones relevant to the query "${query}". 
Respond ONLY as JSON array of {id, title, reason}.`;
````

Gemini interprets this prompt and returns a contextual JSON response, which is then parsed and rendered as clean, user-friendly cards on the dashboard.

🖼️ **Example — AI Search Modal**

![AI Search Screenshot](<img width="1919" height="906" alt="Screenshot 2025-11-08 173153" src="https://github.com/user-attachments/assets/3fd26541-95ee-488b-99f7-663361bb5a1e" />

---

### 🧩 5. Claude API Integration — Backend Intelligence

While **Gemini** handles the search semantics, **Claude API** powers backend routes for:

* **Authentication (Register/Login)** — secure and fast
* **Bookmark CRUD operations** — Create, Retrieve, Update, Delete

These APIs ensure data consistency, authentication validation, and structured responses.

---

## 🛠️ Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| **Frontend**       | React 19 + Next.js 16 (App Router)  |
| **Backend**        | Next.js Route Handlers (API Routes) |
| **Database**       | MongoDB                             |
| **Authentication** | JWT + bcryptjs                      |
| **AI Search**      | Gemini API                          |
| **Bookmark API**   | Claude API                          |
| **Styling**        | Tailwind CSS v4 + shadcn/ui         |
| **Icons**          | Lucide React                        |

---

## ⚙️ Quick Start

### 1️⃣ Clone and Install

```bash
git clone https://github.com/your-username/synapse.git
cd synapse
npm install
```

### 2️⃣ Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://your-db-url
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
CLAUDE_API_KEY=your-claude-api-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🧩 API Overview

### 🔐 Auth

* `POST /api/auth/register` → Create account
* `POST /api/auth/login` → Login and get JWT

### 🗂️ Bookmarks (Authenticated)

* `GET /api/bookmarks` → List all bookmarks
* `POST /api/bookmarks` → Add new bookmark
* `PATCH /api/bookmarks/[id]` → Update existing
* `DELETE /api/bookmarks/[id]` → Delete bookmark

### 🤖 AI Routes

* `POST /api/ai/search` → Gemini-based contextual search
* `POST /api/ai/summarize` → AI-generated content summaries

---

## 🌈 Example Flow

1. **Login** → Enter email & password → JWT generated
2. **Dashboard Loads** → Fetch bookmarks from MongoDB
3. **Add Bookmark** → Submit URL + metadata
4. **AI Search** → Type “white” → Gemini links it to “Penguin” resource
5. **Edit/Delete** → Update description or remove unwanted bookmarks

🖼️ **Example — Login Page**

![Login Screenshot](<img width="1919" height="909" alt="Screenshot 2025-11-08 172825" src="https://github.com/user-attachments/assets/bae2e416-efbd-4823-a228-c5fd08d53fbf" />)

---

## 📘 License

MIT License

---

## 👩‍💻 Author

**Anshika M.** — Developer of *Synapse*

> “Turning your scattered tabs into your visual memory of the web.”

```

---

✅ **Instructions for you:**
1. Copy and paste the above content directly into your VS Code file as `README.md`.  
2. Replace each `<YOUR_IMAGE_URI>` with the **image link** you get after converting your screenshots using an image-to-URI converter (like [https://imgur.com/](https://imgur.com/) or GitHub’s drag-and-drop feature).  
3. Commit and push — it’ll render beautifully on GitHub.

Would you like me to make a **README preview version** (with your current image filenames inserted and ready to convert) so you can just replace the links later?
```
