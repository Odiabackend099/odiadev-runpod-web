# ODIADEV-TTS 1.6B

Proprietary neural voice engine by ODIADEV AI LTD. Convert text to natural speech with our 1.6-billion-parameter model.

## 🚀 Quick Start

### Frontend (Next.js)
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: FastAPI with Python
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (Frontend) + RunPod (Backend)

## 📁 Project Structure

```
odia-tts/
├── app/              # Next.js App Router pages
├── components/       # React components
├── contexts/         # React contexts
├── lib/             # Utilities and configs
├── package.json     # Dependencies
└── vercel.json      # Vercel deployment config
```

## 🔐 Authentication

The app uses Supabase for authentication with email verification:

1. **Register** → Email verification required
2. **Login** → Access dashboard and protected routes
3. **Profile** → Manage account settings
4. **API Keys** → Generate and manage API access

## 🎯 Features

- **Text-to-Speech**: Convert text to natural speech
- **Voice Cloning**: Create custom voice profiles
- **API Management**: Generate and manage API keys
- **Usage Tracking**: Monitor character usage and limits
- **Subscription Tiers**: Free, Pro, Business, Enterprise

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### RunPod (Backend)
1. Clone repository to RunPod instance
2. Install dependencies and configure environment
3. Start FastAPI server

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REDIS_URL=redis://localhost:6379/0
DIA_MODEL_ID=nari-labs/Dia-1.6B
```

## 🔧 Development

1. **Clone repository**
2. **Install dependencies**: `npm install`
3. **Set up Supabase** project and database
4. **Configure environment** variables
5. **Run development server**: `npm run dev`

## 📄 License

Proprietary - © 2025 ODIADEV AI LTD
