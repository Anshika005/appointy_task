# Synapse - Your Visual Memory of the Web

Synapse is a modern, AI-powered bookmark management application that helps you capture, organize, and rediscover your internet discoveries. Built with Next.js, MongoDB, and Claude AI.

## Features

✨ **Beautiful Card-Based UI**
- Visually stunning bookmark cards with images and metadata
- Responsive design that works on all devices
- Smooth animations and interactions

🔐 **Secure Authentication**
- JWT-based authentication system
- Secure password hashing with bcryptjs
- Session token storage in localStorage

🎯 **Smart Bookmark Management**
- Add bookmarks with URLs, titles, descriptions, and images
- Categorize as articles, products, videos, todos, research, or inspiration
- Edit and delete bookmarks anytime
- Rich metadata preservation

🤖 **AI-Powered Features**
- **Natural Language Search**: Ask questions to find bookmarks
- **AI Summaries**: Generate summaries of saved content
- Powered by Claude 3.5 Sonnet

🔍 **Quick Search**
- Instant keyword search across all bookmarks
- Search by title, description, or URL

## Tech Stack

- **Frontend**: React 19 + Next.js 16 (App Router)
- **Backend**: Next.js Route Handlers
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **AI**: Anthropic Claude API
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## Quick Start

1. **Clone and install**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables** (see SETUP_GUIDE.md)
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [API Reference](#api-endpoints) - API endpoint documentation

## Screenshots

### Login Page
Beautiful, minimal login/signup interface

### Dashboard
Card-based bookmark grid with quick actions, search, and AI features

### Add Bookmark Modal
Easy bookmark creation with all metadata fields

### AI Search
Natural language search powered by Claude

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Bookmarks (require auth)
- `GET /api/bookmarks` - List all bookmarks
- `POST /api/bookmarks` - Create bookmark
- `PATCH /api/bookmarks/[id]` - Update bookmark
- `DELETE /api/bookmarks/[id]` - Delete bookmark

### AI
- `POST /api/ai/search` - AI search (requires auth)
- `POST /api/ai/summarize` - Generate summary

## Environment Variables

\`\`\`env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

See `.env.example` for details.

## License

MIT

## Author

Created with v0

---

**Synapse**: Because every bookmark is a memory worth keeping.
