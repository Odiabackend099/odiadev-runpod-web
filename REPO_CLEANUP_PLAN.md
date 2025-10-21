# Repository Cleanup & Reorganization Plan

## 🎯 Objective
Clean up conflicting files, remove unused pages, organize assets, and prepare for production deployment.

## 🗑️ Files to Delete

### Duplicate/Conflicting Frontend Files
```
frontend/                          # Delete entire duplicate frontend folder
├── app/page.tsx                  # Conflicts with root /app/page.tsx
├── components/AudioPlayer.tsx    # Conflicts with root /components/
├── next.config.mjs               # Conflicts with root next.config.js
└── src/app/demo/page.tsx        # Unused demo page
```

### Unnecessary/Temporary Files
```
CURSOR_INTEGRATION_GUIDE.md       # Internal dev doc (keep in .gitignore or docs/)
ENVIRONMENT_VARIABLES.md          # Internal dev doc
planning.md                       # Internal dev doc
RUNPOD_README.md                  # Move to docs/deployment/
PRODUCTION_README.md              # Move to docs/deployment/
requirements.txt (root)           # Duplicate of backend/requirements.txt
```

### Conflicting Next.js Config
```
frontend/next.config.mjs          # Delete (use root next.config.js)
frontend/postcss.config.mjs       # Delete (use root postcss.config.js)
```

## 📁 New Directory Structure

```
/Users/odiadev/Desktop/dia ai tts/odia-tts/
├── app/                          # Next.js 14 App Router (KEEP)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/               # Create new
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main landing page
├── components/                   # React components (KEEP)
│   ├── AudioPlayer.tsx
│   ├── Layout.tsx
│   ├── TTSPlayer.tsx
│   └── VoiceCloner.tsx
├── contexts/                     # React contexts (KEEP)
│   └── AuthContext.tsx
├── lib/                          # Utility libraries (KEEP)
│   ├── api.ts
│   └── supabase.ts
├── public/                       # Create new - Static assets
│   ├── assets/
│   │   ├── img/
│   │   │   ├── logo.png        # ODIADEV logo
│   │   │   ├── austyn.jpg      # CEO photo
│   │   │   ├── benjamin.png    # Tech lead photo
│   │   │   ├── ntaji.png       # Research lead photo
│   │   │   ├── odia.mp3        # Male voice demo
│   │   │   └── joslyn.mp3      # Female voice demo
│   │   └── icons/              # PWA icons
│   ├── chat/                    # Chat widget scripts
│   │   ├── chat-widget.js
│   │   └── config.local.js
│   ├── favicon.ico
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── backend/                      # FastAPI backend (KEEP)
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── infra/                        # Infrastructure (KEEP)
│   ├── compose.yml
│   ├── env.example
│   └── supabase/
├── scripts/                      # Deployment scripts (KEEP)
│   ├── security_audit.sh
│   └── runpod_start.sh         # Move from root
├── docs/                         # Create new - Documentation
│   ├── deployment/
│   │   ├── RUNPOD.md
│   │   ├── VERCEL.md
│   │   └── PRODUCTION.md
│   ├── brand/
│   │   └── BRAND_GUIDE.md
│   └── development/
│       ├── CURSOR_INTEGRATION.md
│       └── ENVIRONMENT_SETUP.md
├── .github/                      # GitHub specific
│   ├── CODEOWNERS
│   ├── pull_request_template.md
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── gitleaks.yml
│   └── SECURITY.md
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

## ✅ Actions to Take

### Phase 1: Delete Conflicting Files
1. Delete `frontend/` directory entirely
2. Delete root `requirements.txt` (keep `backend/requirements.txt`)
3. Delete `planning.md` (move to docs if needed)
4. Delete duplicate configs

### Phase 2: Create New Directories
1. Create `public/` directory for static assets
2. Create `public/assets/img/` for images
3. Create `public/chat/` for chat widget
4. Create `docs/` for documentation
5. Create `docs/deployment/`, `docs/brand/`, `docs/development/`

### Phase 3: Move Files
1. Move `RUNPOD_README.md` → `docs/deployment/RUNPOD.md`
2. Move `PRODUCTION_README.md` → `docs/deployment/PRODUCTION.md`
3. Move `CURSOR_INTEGRATION_GUIDE.md` → `docs/development/CURSOR_INTEGRATION.md`
4. Move `ENVIRONMENT_VARIABLES.md` → `docs/development/ENVIRONMENT_SETUP.md`
5. Move `BRAND_ANALYSIS.md` → `docs/brand/BRAND_GUIDE.md`
6. Move `runpod_start.sh` → `scripts/runpod_start.sh`

### Phase 4: Add Required Assets
1. Create placeholder images:
   - `public/assets/img/logo.png`
   - `public/assets/img/hero-3d.webp`
   - Team photos (austyn.jpg, benjamin.png, ntaji.png)
   - Voice demos (odia.mp3, joslyn.mp3)
2. Create PWA assets:
   - `public/manifest.json`
   - `public/sw.js`
   - Icon files

### Phase 5: Update Imports
1. Update all static asset imports to use `/public/` paths
2. Update API endpoints
3. Update documentation links

### Phase 6: Create Missing Pages
1. Create `app/dashboard/page.tsx` - User dashboard
2. Ensure all auth pages are functional
3. Add 404 and error pages

## 🔒 Security Considerations
- Never commit:
  - `.env` files
  - API keys
  - Team personal photos (use placeholders)
  - Real audio files (copyright)
  
## 📝 Next Steps After Cleanup
1. Run `npm run build` to test
2. Update `.gitignore` to exclude docs/ if needed
3. Push cleaned repository
4. Deploy to Vercel
5. Test all pages and functionality

---

**Execution Date**: October 21, 2025
**Approved By**: Development Team

